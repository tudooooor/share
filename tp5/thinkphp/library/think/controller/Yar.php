<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

namespace think\controller;

/**
 * ThinkPHP YaræŽ§åˆ¶å™¨ç±»
 */
abstract class Yar
{

    /**
     * æž„é€ å‡½æ•°
     * @access public
     */
    public function __construct()
    {
        //æŽ§åˆ¶å™¨åˆ�å§‹åŒ–
        if (method_exists($this, '_initialize')) {
            $this->_initialize();
        }

        //åˆ¤æ–­æ‰©å±•æ˜¯å�¦å­˜åœ¨
        if (!extension_loaded('yar')) {
            throw new \Exception('not support yar');
        }

        //å®žä¾‹åŒ–Yar_Server
//        $server = new \Yar_Server($this);
        // å�¯åŠ¨server
        $server->handle();
    }

    /**
     * é­”æœ¯æ–¹æ³• æœ‰ä¸�å­˜åœ¨çš„æ“�ä½œçš„æ—¶å€™æ‰§è¡Œ
     * @access public
     * @param string $method æ–¹æ³•å��
     * @param array $args å�‚æ•°
     * @return mixed
     */
    public function __call($method, $args)
    {}
}
