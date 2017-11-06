<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2017 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

namespace think\cache\driver;

use Memcache;
use think\cache\Driver;

class Memcached extends Driver
{
    protected $options = [
        'host'     => '127.0.0.1',
        'port'     => 11211,
        'expire'   => 0,
        'timeout'  => 0, // è¶…æ—¶æ—¶é—´ï¼ˆå�•ä½�ï¼šæ¯«ç§’ï¼‰
        'prefix'   => '',
        'username' => '', //è´¦å�·
        'password' => '', //å¯†ç �
        'option'   => [],
    ];

    /**
     * æž„é€ å‡½æ•°
     * @param array $options ç¼“å­˜å�‚æ•°
     * @access public
     */
    public function __construct($options = [])
    {
        if (!extension_loaded('memcached')) {
            throw new \BadFunctionCallException('not support: memcached');
        }
        if (!empty($options)) {
            $this->options = array_merge($this->options, $options);
        }
        $this->handler = new Memcache;
        if (!empty($this->options['option'])) {
            $this->handler->setOptions($this->options['option']);
        }
        // è®¾ç½®è¿žæŽ¥è¶…æ—¶æ—¶é—´ï¼ˆå�•ä½�ï¼šæ¯«ç§’ï¼‰
        if ($this->options['timeout'] > 0) {
            $this->handler->setOption(Memcache::OPT_CONNECT_TIMEOUT, $this->options['timeout']);
        }
        // æ”¯æŒ�é›†ç¾¤
        $hosts = explode(',', $this->options['host']);
        $ports = explode(',', $this->options['port']);
        if (empty($ports[0])) {
            $ports[0] = 11211;
        }
        // å»ºç«‹è¿žæŽ¥
        $servers = [];
        foreach ((array) $hosts as $i => $host) {
            $servers[] = [$host, (isset($ports[$i]) ? $ports[$i] : $ports[0]), 1];
        }
        $this->handler->addServers($servers);
        if ('' != $this->options['username']) {
            $this->handler->setOption(Memcache::OPT_BINARY_PROTOCOL, true);
            $this->handler->setSaslAuthData($this->options['username'], $this->options['password']);
        }
    }

    /**
     * åˆ¤æ–­ç¼“å­˜
     * @access public
     * @param string $name ç¼“å­˜å�˜é‡�å��
     * @return bool
     */
    public function has($name)
    {
        $key = $this->getCacheKey($name);
        return $this->handler->get($key) ? true : false;
    }

    /**
     * è¯»å�–ç¼“å­˜
     * @access public
     * @param string $name ç¼“å­˜å�˜é‡�å��
     * @param mixed  $default é»˜è®¤å€¼
     * @return mixed
     */
    public function get($name, $default = false)
    {
        $result = $this->handler->get($this->getCacheKey($name));
        return false !== $result ? $result : $default;
    }

    /**
     * å†™å…¥ç¼“å­˜
     * @access public
     * @param string            $name ç¼“å­˜å�˜é‡�å��
     * @param mixed             $value  å­˜å‚¨æ•°æ�®
     * @param integer|\DateTime $expire  æœ‰æ•ˆæ—¶é—´ï¼ˆç§’ï¼‰
     * @return bool
     */
    public function set($name, $value, $expire = null)
    {
        if (is_null($expire)) {
            $expire = $this->options['expire'];
        }
        if ($expire instanceof \DateTime) {
            $expire = $expire->getTimestamp() - time();
        }
        if ($this->tag && !$this->has($name)) {
            $first = true;
        }
        $key    = $this->getCacheKey($name);
        $expire = 0 == $expire ? 0 : $_SERVER['REQUEST_TIME'] + $expire;
        if ($this->handler->set($key, $value, $expire)) {
            isset($first) && $this->setTagItem($key);
            return true;
        }
        return false;
    }

    /**
     * è‡ªå¢žç¼“å­˜ï¼ˆé’ˆå¯¹æ•°å€¼ç¼“å­˜ï¼‰
     * @access public
     * @param string    $name ç¼“å­˜å�˜é‡�å��
     * @param int       $step æ­¥é•¿
     * @return false|int
     */
    public function inc($name, $step = 1)
    {
        $key = $this->getCacheKey($name);
        if ($this->handler->get($key)) {
            return $this->handler->increment($key, $step);
        }
        return $this->handler->set($key, $step);
    }

    /**
     * è‡ªå‡�ç¼“å­˜ï¼ˆé’ˆå¯¹æ•°å€¼ç¼“å­˜ï¼‰
     * @access public
     * @param string    $name ç¼“å­˜å�˜é‡�å��
     * @param int       $step æ­¥é•¿
     * @return false|int
     */
    public function dec($name, $step = 1)
    {
        $key   = $this->getCacheKey($name);
        $value = $this->handler->get($key) - $step;
        $res   = $this->handler->set($key, $value);
        if (!$res) {
            return false;
        } else {
            return $value;
        }
    }

    /**
     * åˆ é™¤ç¼“å­˜
     * @param    string  $name ç¼“å­˜å�˜é‡�å��
     * @param bool|false $ttl
     * @return bool
     */
    public function rm($name, $ttl = false)
    {
        $key = $this->getCacheKey($name);
        return false === $ttl ?
        $this->handler->delete($key) :
        $this->handler->delete($key, $ttl);
    }

    /**
     * æ¸…é™¤ç¼“å­˜
     * @access public
     * @param string $tag æ ‡ç­¾å��
     * @return bool
     */
    public function clear($tag = null)
    {
        if ($tag) {
            // æŒ‡å®šæ ‡ç­¾æ¸…é™¤
            $keys = $this->getTagItem($tag);
            $this->handler->deleteMulti($keys);
            $this->rm('tag_' . md5($tag));
            return true;
        }
        return $this->handler->flush();
    }
}
