<?php
return array (
  'db_type' => 'mysql',
  'db_host' => '127.0.0.1',
  'db_name' => 'orangeweipin',
  'db_user' => 'root',
  'db_pwd' => '!share123',
  'db_port' => 0,
  'db_prefix' => 'tp_',
  'web_name' => '橙子微拼',
  'web_url' => 'http://www.liuanyunkeji.com/',
  'web_path' => '/',
  'web_icp' => '浙ICP备xxxxxx号',
  'CRON_MAX_TIME' => 60,
  'web_copyright' => '版权所有 © 浙江橙子微拼网络股份有限公司 2017 - 2022',
  'web_tongji' => '',
  'web_admin_pagenum' => 20,
  'web_home_pagenum' => 15,
  'web_adsensepath' => 'Public/Banner',
  'upload_config' => 
  array (
    'allowExts' => 
    array (
      0 => 'jpg',
      1 => 'gif',
      2 => 'png',
      3 => 'jpeg',
    ),
    'maxSize' => 3145728,
    'savePath' => './Uploads/',
    'autoSub' => true,
    'subType' => 'date',
  ),
  'yun_oss' => 
  array (
    'oss_open' => '0',
    'access_key_id' => '',
    'access_key_secret' => '',
    'bucket' => '',
    'endpoint' => '',
    'is_delete' => '1',
  ),
  'group' => 
  array (
    'notify_hour' => '5',
    'expire_time' => '24',
  ),
  'weapp' => 
  array (
    'appid' => 'wxecc34bcaf2826227',
    'appsecret' => '504c2ca69e9425492a70cc8aa928a9c6',
    'nick_pre' => '',
    'headimgurl' => '',
    'mchid' => '',
    'key' => '',
    'ssl_cert' => '',
    'ssl_key' => '',
  ),
  'weapp_tpl' => 
  array (
    'open' => '0',
    'pay_notify_tpl' => '',
    'shipping_notify_tpl' => '',
    'refound_notify_tpl' => '',
    'group_notify_tpl' => '',
  ),
  'shipping_banner' => 
  array (
    'open' => '1',
    'desc' => '由于双十一原因，11月10日14:00之后成团的订单统一于11月16日开始发货（零食玩具类订单除外）。期间可照常下单哦~天气凉了，多注意保暖~',
  ),
  'export' => 
  array (
    'order_field' => 'order_id,order_sn,order_goods.goods_name,order_status,receive_name,mobile,shipping_address,',
    'order_field_name' => '订单ID,订单编号,物品名称,订单状态,收货人,收货号码,收货地址,',
  ),
);
?>