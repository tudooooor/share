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

namespace think\session\driver;

use Memcache;
use SessionHandler;
use think\Exception;

class Memcached extends SessionHandler
{
    protected $handler = null;
    protected $config  = [
        'host'         => '127.0.0.1', // memcacheä¸»æœº
        'port'         => 11211, // memcacheç«¯å�£
        'expire'       => 3600, // sessionæœ‰æ•ˆæœŸ
        'timeout'      => 0, // è¿žæŽ¥è¶…æ—¶æ—¶é—´ï¼ˆå�•ä½�ï¼šæ¯«ç§’ï¼‰
        'session_name' => '', // memcache keyå‰�ç¼€
        'username'     => '', //è´¦å�·
        'password'     => '', //å¯†ç �
    ];

    public function __construct($config = [])
    {
        $this->config = array_merge($this->config, $config);
    }

    /**
     * æ‰“å¼€Session
     * @access public
     * @param string    $savePath
     * @param mixed     $sessName
     */
    public function open($savePath, $sessName)
    {
        // æ£€æµ‹phpçŽ¯å¢ƒ
        if (!extension_loaded('memcached')) {
            throw new Exception('not support:memcached');
        }
        $this->handler = new Memcache;
        // è®¾ç½®è¿žæŽ¥è¶…æ—¶æ—¶é—´ï¼ˆå�•ä½�ï¼šæ¯«ç§’ï¼‰
        if ($this->config['timeout'] > 0) {
            $this->handler->setOption(Memcache::OPT_CONNECT_TIMEOUT, $this->config['timeout']);
        }
        // æ”¯æŒ�é›†ç¾¤
        $hosts = explode(',', $this->config['host']);
        $ports = explode(',', $this->config['port']);
        if (empty($ports[0])) {
            $ports[0] = 11211;
        }
        // å»ºç«‹è¿žæŽ¥
        $servers = [];
        foreach ((array) $hosts as $i => $host) {
            $servers[] = [$host, (isset($ports[$i]) ? $ports[$i] : $ports[0]), 1];
        }
        $this->handler->addServers($servers);
        if ('' != $this->config['username']) {
            $this->handler->setOption(Memcache::OPT_BINARY_PROTOCOL, true);
            $this->handler->setSaslAuthData($this->config['username'], $this->config['password']);
        }
        return true;
    }

    /**
     * å…³é—­Session
     * @access public
     */
    public function close()
    {
        $this->gc(ini_get('session.gc_maxlifetime'));
        $this->handler->quit();
        $this->handler = null;
        return true;
    }

    /**
     * è¯»å�–Session
     * @access public
     * @param string $sessID
     */
    public function read($sessID)
    {
        return (string) $this->handler->get($this->config['session_name'] . $sessID);
    }

    /**
     * å†™å…¥Session
     * @access public
     * @param string $sessID
     * @param String $sessData
     * @return bool
     */
    public function write($sessID, $sessData)
    {
        return $this->handler->set($this->config['session_name'] . $sessID, $sessData, $this->config['expire']);
    }

    /**
     * åˆ é™¤Session
     * @access public
     * @param string $sessID
     * @return bool
     */
    public function destroy($sessID)
    {
        return $this->handler->delete($this->config['session_name'] . $sessID);
    }

    /**
     * Session åžƒåœ¾å›žæ”¶
     * @access public
     * @param string $sessMaxLifeTime
     * @return true
     */
    public function gc($sessMaxLifeTime)
    {
        return true;
    }
}
