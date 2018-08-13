<?php
/**
 * ============================================================================
 * Copyright (c) 2016-2017 #### All rights reserved.
 * ----------------------------------------------------------------------------
 * 文件名称：WeuserAction.class.php
 * ----------------------------------------------------------------------------
 * 功能描述：########
 * ----------------------------------------------------------------------------
 * 作者:chenbei
 * ----------------------------------------------------------------------------
 * 时间:上午10:52:59
 * ----------------------------------------------------------------------------
 */
class WeuserAction extends ApiAction {
    public $MemberDb;
    public $memberInfo;
    public function _initialize() {
        parent::_initialize();

        $token = I('get.token');
        $this->MemberDb = D('Member');
        $MemberTokenDB  = D('MemberToken');
        
        $memberInfo = $MemberTokenDB->getUser($token);
        
        $time = time();
        if(!$memberInfo) {
           $this->memberInfo =false;
           echo json_encode(array('result' => 'fail','error_code' => 40001,'error_info' => '用户校验失败 token:' + $token));
           exit;
        }
        
        $this->memberInfo = $memberInfo;

        $config = array(
            'appid' => '1400089351',//控制台查看
            'appkey' => 'd1010ebf524beab7b2b0c447c0f36e06',//控制台查看
            'templId' => '29555',
            'nationCode' => '86', //国家或地区区号,香港852，大陆86
        );
        $this->config = $config;

    }
    
    /**
     * 获取个人信息
     */
    public function me() {
        echo json_encode(array('result'=>'ok','user_info'=>$this->memberInfo));
    }
    
    
    /**
     * 获取用户所在地
     */
    public function regions() {
        $RegionDb = D('Region');
        $data = file_get_contents("php://input");
        $data = json_decode($data,true);
        $province = $RegionDb->getRegionByName($data['province'],array('level' => 1));
        $city = $RegionDb->getRegionByName($data['city'],array('level' => 2,'parent_id' => $province['region_id']));
        $district = $RegionDb->getRegionByName($data['district'],array('level' => 3,'parent_id' => $city['region_id']));
        
        $ret['region']['country_id'] = "1";
        $ret['region']['province_id'] = $province['region_id'];
        $ret['region']['city_id'] = $city['region_id'];
        $ret['region']['district_id'] = $district['region_id'];
        $ret['result'] = 'ok';
        echo json_encode($ret);
    }
    
    public function address() {
        $AddressDb = D('Address');
        $RegionDb = D('Region');
                    
        //添加地址
        if($this->isPost()) {
            $data = file_get_contents("php://input");
            $data = json_decode($data,true);
            
            $data['member_id'] = $this->memberInfo['member_id'];
            $data['province_id'] = $data['province'];
            $data['city_id'] = $data['city'];
            $data['district_id'] = $data['district'];
            $province = $RegionDb->getRegionById($data['province']);
            $city = $RegionDb->getRegionById($data['city']);
            $district = $RegionDb->getRegionById($data['district']);
            
            $data['full_address'] = $province['region_name'].$city['region_name'].$district['region_name'].$data['address'];
            
            $data['province'] = $province['region_name'];
            $data['city'] = $city['region_name'];
            $data['district'] = $district['region_name'];
            
            $data['created_time'] = time();
            $data['last_updated_time'] = time();
            $address_id = $AddressDb->add($data);
            
            $ret['result'] = 'ok';
            $ret['address_id'] = $address_id;
            echo json_encode($ret);
            exit;
        }
        
        //修改地址
        if($this->isPut()) {
            $address_id = I('get.address_id');
            $data = file_get_contents("php://input");
            $data = json_decode($data,true);
            
            $data['province_id'] = $data['province'];
            $data['city_id'] = $data['city'];
            $data['district_id'] = $data['district'];
            $province = $RegionDb->getRegionById($data['province']);
            $city = $RegionDb->getRegionById($data['city']);
            $district = $RegionDb->getRegionById($data['district']);
            
            $data['province'] = $province['region_name'];
            $data['city'] = $city['region_name'];
            $data['district'] = $district['region_name'];
            
            $data['full_address'] = $province['region_name'].$city['region_name'].$district['region_name'].$data['address'];
            
            $data['last_updated_time'] = time();
            
            $AddressDb->where(array('address_id' => $address_id,'member_id' => $this->memberInfo['member_id']))->save($data);
            
            $ret['result'] = 'ok';
            
            echo json_encode($ret);
            exit;
        }
        
        //获取地址
        if($this->isGet()) {
            $address_id = I('get.address_id');
            if($address_id) {
                $map['address_id'] = $address_id;
            } else {
                $map['status'] = 'DEFAULT';
            }
            $map['member_id'] = $this->memberInfo['member_id'];
            $ret['address'] = $AddressDb->getAddr($map);
            $ret['result'] = 'ok';

            echo json_encode($ret);
            exit;
        }
        
        //删除地址
        if($this->isDelete()) {
            $address_id = I('get.address_id');
            if($AddressDb->where(array('member_id' => $this->memberInfo['member_id'],'address_id' => $address_id))->delete()) {
                $ret['result'] = 'ok';
            } else {
                $ret['result'] = 'fail';
                $ret['error_info'] = '非法提交';
            }
            echo json_encode($ret);
            exit;
        }
    }
    
    /**
     * 地址列表
     */
    public function addresses() {
        $AddressDb = D('Address');
        if($this->isPut()) {
            $address_id = I('get.address_id');
            $rev = file_get_contents("php://input");
            $rev = json_decode($rev,true);
            
            $AddressDb->where(array('member_id' => $this->memberInfo['member_id']))->save(array('status' => 'COMMON'));
            $data['status'] = $rev['status'];
            
            $AddressDb->where(array('member_id' => $this->memberInfo['member_id'],'address_id' => $address_id))->save($data);
            
            $ret['result'] = 'ok';
            echo json_encode($ret);
            exit;
        }
        
        $ret['address_list'] = $AddressDb->getAddress(array('member_id'=>$this->memberInfo['member_id']));
        $ret['result'] = 'ok';
        echo json_encode($ret);
    }

    public function getStatDataYear()
    {
        $map = array('seller_id' => $this->memberInfo['member_id']);
        $OrdersDb = D('Orders');
        $groupBuyCount = array();
        for ($month = 0; $month < 12; $month++)
        {
            $startTime = mktime(0,0,0, $month + 1, 1,2018);
            $tttt = date("Y-m-d", $startTime);
            $endTime = mktime(0,0,0, $month + 2, 1,2018);
            $tttt = date("Y-m-d", $endTime);
            $array[$month] = $endTime - $startTime;
            $map['order_time'] = array('between',array($startTime,$endTime));
            $groupBuyCount[$month] = $OrdersDb->where($map)->count();
        }

        $ret['statistic_list'] = $groupBuyCount;
        $ret['result'] = 0;
        echo json_encode($ret);
    }

    
    public function getStatDataMonth()
    {
        $year = I('get.year');
        $month = I('get.month');
        $count = I('get.count');
        $map = array('seller_id' => $this->memberInfo['member_id']);
        $OrdersDb = D('Orders');
        $groupBuyCount = array();
        for ($index = 0; $index < $count; $index++)
        {
            $startTime = mktime(0,0,0, $month, $index + 1,$year);
            $tttt = date("Y-m-d", $startTime);
            $endTime = mktime(0,0,0, $month, $index + 2,$year);
            $tttt = date("Y-m-d", $endTime);
            $array[$index] = $endTime - $startTime;
            $map['order_time'] = array('between',array($startTime,$endTime));
            $groupBuyCount[$index] = $OrdersDb->where($map)->count();
        }

        $ret['statistic_list'] = $groupBuyCount;
        $ret['result'] = 0;
        echo json_encode($ret);
    }
   
    public function getStatDataDay()
    {
        $year = I('get.year');
        $month = I('get.month');
        $day = I('get.day');
        $map = array('seller_id' => $this->memberInfo['member_id']);
        $OrdersDb = D('Orders');
        $groupBuyCount = array();

        $startTime = mktime(0,0,0, $month, $day,$year);
        $tttt = date("Y-m-d", $startTime);
        $endTime = mktime(0,0,0, $month, $day + 1,$year);
        $tttt = date("Y-m-d", $endTime);
        
        $map['order_time'] = array('between',array($startTime,$endTime));
        $groupBuyCount = array();
        $groupBuyCount = $OrdersDb->where($map)->select();
        
        $orders = array();
  
        for ($i = 0; $i < count($groupBuyCount); $i++)
        {
            $orders[$i]['order_sn'] = $groupBuyCount[$i]['order_sn'];
            $orders[$i]['order_status'] = $groupBuyCount[$i]['order_status'];
            $orders[$i]['order_id'] = $groupBuyCount[$i]['order_id'];

        }
        $ret['orders'] = $orders;
        $ret['result'] = 0;
        echo json_encode($ret);
    }


       /**
     * 商品详情
     */
    public function detail() {
        $GoodsDb = D('Goods');
        $goods_id = $this->_get('goods_id','intval',0);
        
        if(!$goods_id) {
            echo json_encode(array('result'=>'fail','error_info'=>'错误的请求地址或方法'));
            return;
        }
        
        $detail = $GoodsDb->getGoods('goods_id = ' . $goods_id);
        
        if(!$detail){
            echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'商品已下架或不存在'));
            return;
        }
        
        $imgs = unserialize($detail['goods_imgs']);
        $imgsDetail = unserialize($detail['goods_imgs_detail']);
        foreach($imgs as $v) {
            $gallery[]['img_url'] =  $v;
        }

        foreach($imgsDetail as $v) {
            $galleryDetail[]['img_url'] =  $v;
        }

        $this->addGood();


        $AddressDb = D('Address');
        $map['status'] = 'DEFAULT';
        $map['member_id'] = $this->memberInfo['member_id'];
        $address = $AddressDb->getAddr($map);
        
        $ret = array('result'=>'ok', 'goods'=>$detail,'gallery'=>$gallery, 'galleryDetail'=>$galleryDetail);
        $ret['address_id'] = $address['address_id'];
        $ret['full_address'] = $address['full_address'];

        $map = array('member_id' => $detail['member_id']);
        $MemberDbOther = D('Member');
        $members = $MemberDbOther->where($map)->find();
        
        $ret['phoneNumber'] = $members['mobile'];

        echo json_encode($ret);   
    }

    public function addGood() {
        $GoodsDb = D('Goods');
        $goods_id = I('get.goods_id');
        $map = array('member_id' => $this->memberInfo['member_id']);
        $goods = $this->MemberDb->where($map)->field('goods')->select();
        
        $good = $GoodsDb->where(array('goods_id' => $goods_id))->select();
        $member_id = $good[0]['member_id'];  
        
        $goodsArray;
        if ($goods[0]['goods'] == "")
        {
            $goodsArray = array();
        }
        else
        {
            $goodsArray = unserialize($goods[0]['goods']);           
        }

        $temp = array_push($goodsArray, $member_id);
        $goodsArray = array_unique($goodsArray);
        
        $serialTemp = serialize($goodsArray);
        $this->MemberDb->__set('goods', $serialTemp);
        $result = $this->MemberDb->save();

    }

    public function shoplist() {
        $map = array('member_id' => $this->memberInfo['member_id']);
        $members = $this->MemberDb->where($map)->field('goods')->select();
        $membersArray;
        $GoodsDb = D('Goods');
        $MemberDbOther = D('Member');
        $ret = array();
        if ($members[0]['goods'] == "")
        {
            $membersArray = array();
        }
        else
        {
            $membersArray = unserialize($members[0]['goods']);           
        }

        for ($i = 0; $i < count($membersArray); $i++)
        {
            if ($membersArray[$i] != '7')
            {
                $members = $MemberDbOther->where(array('member_id' => $membersArray[$i]))->select();
        
                $ret[$i]['nickName'] = $members[0]['nickname'];
                $ret[$i]['shopName'] = $members[0]['shop_name'];
                $ret[$i]['shopDesc'] = $members[0]['shop_desc'];
                $ret[$i]['shopImg'] = $members[0]['shop_logo'];
                $good = $GoodsDb->where(array('member_id' => $members[0]['member_id']))->select();
                $ret[$i]['goods'] = $good;
            }
        }

        $members = $MemberDbOther->where(array('member_id' => '7'))->select();
        $member_id = $members[0]['member_id'];
        $default['nickName'] = $members[0]['nickname'];
        $default['shopName'] = $members[0]['shop_name'];
        $default['shopDesc'] = $members[0]['shop_desc'];
        $default['shopImg'] = $members[0]['shop_logo'];
        $map = array('member_id' => $member_id);
        $GoodsDb = D('Goods');
        $good = $GoodsDb->where($map)->select();

        $default['goods'] = $good;

        array_push($ret, $default);
        echo json_encode($ret);
    }


    public function goodslists() {
        $good_id = I('get.good_id');
        $GoodsDb = D('Goods');

        $ret['nickName'] = $this->memberInfo['nickName'];
        $ret['shopName'] = $this->memberInfo['shop_name'];
        $ret['shopDesc'] = $this->memberInfo['shop_desc'];
        $ret['shopImg'] = $this->memberInfo['shop_logo'];
       
        $GoodsDb = D('Goods');
                
        $offset = I('get.offset');
        $size = I('get.size');
        
        $list = $GoodsDb->where(array('member_id' => $this->memberInfo['member_id']))->order('goods_sort ASC')->limit($offset,$size)->select();
        $ret['goods'] = $list;
 
        $ret['result'] = 'ok';
        echo json_encode($ret);
    }

    public function sendMsg($phone, $code) {
        vendor('Qcloudsms.SmsSender');
        $config = $this->config;
        $singleSender = new \SmsSingleSender($config['appid'], $config['appkey']);
        // 普通单发
        $result = $singleSender->send(0, $config['nationCode'], $phone, $code . "为您的登录验证码，请于60分钟内填写。如非本人操作，请忽略本短信。" , "", "");
        //返回的成功示例：{"result":0,"errmsg":"OK","ext":"","sid":"2:670479-0268698729-028972-001510040916","fee":1}
        //result为0表示发送成功
        $rsp = json_decode($result, true);
        return $rsp;
    }

    public function getQCode() {
        $good_id = I('get.good_id');
         
        $GoodsDb = D('Goods');
        $MemberDbOther = D('Member');
        $good = $GoodsDb->where(array('goods_id' => $good_id))->select();
        $member_id = $good[0]['member_id'];
        $otherMember = $MemberDbOther->where(array('member_id' => $member_id))->select();
        $ret['shop_qcode'] = $otherMember[0]['shop_qcode'];

        $ret['result'] = 0;
        echo json_encode($ret); 
    }
    
    public function getShopData() {

        $ret['shopName'] = $this->memberInfo['shop_name'];
        $ret['shopImg'] = $this->memberInfo['shop_logo'];
        $ret['shopDesc'] = $this->memberInfo['shop_desc'];
        $ret['shopQCode'] = $this->memberInfo['shop_qcode'];
        $ret['statusCode'] = 0;
        echo json_encode($ret); 
    }

    public function shopEdit() {
        $shop_name = $_GET['shopName'];
        $shop_logo = $_GET['shopImg'];
        $shop_desc = $_GET['shopDesc'];
        $shop_qcode = $_GET['shopQCode'];
        $map = array('member_id' => $this->memberInfo['member_id']);

        $result = $this->MemberDb->where($map)->__set('shop_name', $shop_name);
        $result = $this->MemberDb->where($map)->__set('shop_logo', $shop_logo);
        $result = $this->MemberDb->where($map)->__set('shop_qcode', $shop_qcode);
        $result = $this->MemberDb->where($map)->__set('shop_desc', $shop_desc);
        $result = $this->MemberDb->save();
        $ret['statusCode'] = 0;
        echo json_encode($ret); 
    }

    public function mobile()
    {
        $code = rand(1000, 9999); 
        $ret = $this->sendMsg($_GET['phoneNum'], $code);

        $map = array('member_id' => $this->memberInfo['member_id']);
        $result = $this->MemberDb->where($map)->__set('code', $code);
        $result = $this->MemberDb->where($map)->__set('codeTime', time());
        $result = $this->MemberDb->save();
        echo json_encode($ret); 
    }
    
    public function saveMobile()
    {
        $map = array('member_id' => $this->memberInfo['member_id']);
        $timeTemp = $this->MemberDb->where($map)->field('codeTime')->select();
        $time = (int)$timeTemp[0]['codeTime'];
        $codeTemp = $this->MemberDb->where($map)->field('code')->select();
        $code = (int)$codeTemp[0]['code'];
        if ((time() - $time) > 60)
        {
            $ret['time'] = $time;
            $ret['statusCode'] = 1;
            return json_encode($ret);
        }

        if ($_GET['code'] != $code)
        {
            $ret['code'] = $code;
            $ret['statusCode'] = 2;
            return json_encode($ret);
        }

        $ret['statusCode'] = 0;
        $result = $this->MemberDb->where($map)->__set('mobile', $_GET['phoneNum']);
        $result = $this->MemberDb->save();
        
        echo json_encode($ret); 
    }

    public function getPersonInfo()
    {
        $map = array('member_id' => $this->memberInfo['member_id']);
        $phoneNumTemp = $this->MemberDb->where($map)->field('mobile')->select();
        $ret['phoneNum'] = $phoneNumTemp[0]['mobile'];
        $ret['result'] = 0;

        echo json_encode($ret); 
    }


    protected function _requestGet($url, $ssl=true) {
        // curl完成
        $curl = curl_init();

        //设置curl选项
        curl_setopt($curl, CURLOPT_URL, $url);//URL
        $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '
Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0 FirePHP/0.7.4';
        curl_setopt($curl, CURLOPT_USERAGENT, $user_agent);//user_agent，请求代理信息
        curl_setopt($curl, CURLOPT_AUTOREFERER, true);//referer头，请求来源
        curl_setopt($curl, CURLOPT_TIMEOUT, 30);//设置超时时间

        //SSL相关
        if ($ssl) {
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);//禁用后cURL将终止从服务端进行验证
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);//检查服务器SSL证书中是否存在一个公用名(common name)。
        }
        curl_setopt($curl, CURLOPT_HEADER, false);//是否处理响应头
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);//curl_exec()是否返回响应结果

        // 发出请求
        $response = curl_exec($curl);
        if (false === $response) {
            echo '<br>', curl_error($curl), '<br>';
            return false;
        }
        curl_close($curl);
        return $response;
    }

     protected function _requestPost($url, $data, $ssl=true) {
            //curl完成
            $curl = curl_init();
            //设置curl选项
            curl_setopt($curl, CURLOPT_URL, $url);//URL
            $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '
    Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0 FirePHP/0.7.4';
            curl_setopt($curl, CURLOPT_USERAGENT, $user_agent);//user_agent，请求代理信息
            curl_setopt($curl, CURLOPT_AUTOREFERER, true);//referer头，请求来源
            curl_setopt($curl, CURLOPT_TIMEOUT, 30);//设置超时时间
            //SSL相关
            if ($ssl) {
                curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);//禁用后cURL将终止从服务端进行验证
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);//检查服务器SSL证书中是否存在一个公用名(common name)。
            }
            // 处理post相关选项
            curl_setopt($curl, CURLOPT_POST, true);// 是否为POST请求
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);// 处理请求数据
            // 处理响应结果
            curl_setopt($curl, CURLOPT_HEADER, false);//是否处理响应头
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);//curl_exec()是否返回响应结果

            // 发出请求
            $response = curl_exec($curl);
            if (false === $response) {
                echo '<br>', curl_error($curl), '<br>';
                return false;
            }
            curl_close($curl);
            return $response;
    }

    

    public function _getAccessToken() {

        // 考虑过期问题，将获取的access_token存储到某个文件中

        // 目标URL：        
        $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".C('weapp.appid')."&secret=".C('weapp.appsecret');
        //向该URL，发送GET请求
        $result = $this->_requestGet($url);
        if (!$result) {
            return false;
        }
        // 存在返回响应结果
        $result_obj = json_decode($result);

        return $result_obj->access_token;
    }


    public function getwxacode()
    {
        
        $access_token = $this->_getAccessToken();

        $url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='.$access_token;

        $data = array();  
        $good_id = I('get.good_id');
        if ($good_id == NULL)
        {
            $data['scene'] = 'shop:'.$this->memberInfo['member_id'];//自定义信息，可以填写诸如识别用户身份的字段，注意用中文时的情况  
            $data['page'] = 'pages/shopOwner/shopOwner';//扫描后对应的path  
            $fileName = 'shop'.$this->memberInfo['member_id'];
        }
        else
        {
            $data['scene'] = 'good:'.$good_id;//自定义信息，可以填写诸如识别用户身份的字段，注意用中文时的情况  
            $data['page'] = 'pages/goodsDetail/goodsDetail';//扫描后对应的path  
            $fileName = 'good'.$good_id;
        }
        $savePath = C('upload_config.savePath');
   
        $data['width'] = 400;//自定义的尺寸  
        $data['auto_color'] = false;//是否自定义颜色  
        $color = array(  
            "r"=>"221",  
            "g"=>"0",  
            "b"=>"0",  
        );  
        $data['line_color'] = $color;//自定义的颜色值  
        $data = json_encode($data); 
        $result = $this->_requestPost($url,$data);  
 
        $QRcodePath = $savePath."QRcode/".$fileName.".jpg";
        
        $ret['result'] = file_put_contents($QRcodePath,$result);			//	将获取到的二维码图片流保存成图片文件
        if ($ret['result'] != false)
        {
            $ret['result'] = 0;
        }
        else
        {
            $ret['result'] = 1;
        }
        $QRcodePath = C('web_url').  'Uploads/'."QRcode/".$fileName.".jpg";
        $ret['filePath'] = $QRcodePath;

        echo json_encode($ret);
    }
    
    public function lists() {
        $good_id = I('get.good_id');
        $member_id = I('get.member_id');
        if ($good_id != NULL)
         {           
            $GoodsDb = D('Goods');
             $MemberDbOther = D('Member');
             $good = $GoodsDb->where(array('goods_id' => $good_id))->select();
             $member_id = $good[0]['member_id'];
             $otherMember = $MemberDbOther->where(array('member_id' => $member_id))->select();
             $nickName = $otherMember[0]['nickname'];
             $shopOwnerImg = $otherMember[0]['headimgurl'];
 
             $ret['shopName'] = $otherMember[0]['shop_name'];
             $ret['shopDesc'] = $otherMember[0]['shop_desc'];
             $ret['shopImg'] =  $otherMember[0]['shop_logo'];
             $ret['nickName'] = $nickName;
             $ret['shopOwnerImg'] = $shopOwnerImg;
         }
         else if ($member_id != NULL)
         {
            $MemberDbOther = D('Member');
            $otherMember = $MemberDbOther->where(array('member_id' => $member_id))->select();

             $ret['shopName'] = $otherMember[0]['shop_name'];
             $ret['shopImg'] =  $otherMember[0]['shop_logo'];

         }
         else
         {
             $member_id = $this->memberInfo['member_id'];
             $ret['shopName'] = $this->memberInfo['shop_name'];
             $ret['shopImg'] =  $this->memberInfo['shop_logo'];
         }
         $map = array('member_id' => $member_id);
 
         $GoodsDb = D('Goods');
         $GoodCateDb = D('GoodsCate');
 
         $offset = I('get.offset');
         $size = I('get.size');
 
         $cate_id = I('get.cate_id',0,'intval');
 
         $list = $GoodsDb->where($map)->order('goods_sort ASC')->limit($offset,$size)->select();
         if(!$list) {
             $ret['goods'] = array();
         } else {
             $ret['goods'] = $list;
         }
         $ret['result'] = 'ok';

         echo json_encode($ret);
     }
 


        /**
     * 地址列表
     */
    public function shops() {
        $ShopsDb = D('shops');
        
        //添加地址
        if($this->isPost()) {
            if($ShopsDb->create()) {
                $data['member_id'] = $this->memberInfo['member_id'];
                $data['shop_name'] = $_POST['shop_name'];

                $shop_Id = $ShopsDb->add();
                
                // if($goodId) {
                //     $this->success('添加成功',U('Admin/Goods/index'));
                // } else {
                //     $this->error('添加失败',U('Admin/Goods/index'));
                // }
            } else {
                $this->error($GoodsDb->getError());
            }


            
            $ret['result'] = 'ok';
            $ret['shop_id'] = $shop_Id;
            echo json_encode($ret);
            exit;
        }
        
        //修改地址
        if($this->isPut()) {
            $address_id = I('get.address_id');
            $data = file_get_contents("php://input");
            $data = json_decode($data,true);
            
            $data['province_id'] = $data['province'];
            $data['city_id'] = $data['city'];
            $data['district_id'] = $data['district'];
            $province = $RegionDb->getRegionById($data['province']);
            $city = $RegionDb->getRegionById($data['city']);
            $district = $RegionDb->getRegionById($data['district']);
            
            $data['province'] = $province['region_name'];
            $data['city'] = $city['region_name'];
            $data['district'] = $district['region_name'];
            
            $data['full_address'] = $province['region_name'].$city['region_name'].$district['region_name'].$data['address'];
            
            $data['last_updated_time'] = time();
            
            $AddressDb->where(array('address_id' => $address_id,'member_id' => $this->memberInfo['member_id']))->save($data);
            
            $ret['result'] = 'ok';
            
            echo json_encode($ret);
            exit;
        }
    }
    /**
     * 提交订单
     */
    public function orders() {
        if($this->isPost()) {
            if ($this->memberInfo['mobile'] == NULL)
            {
                echo json_encode(array('result'=>'fail', 'error_code'=>41002,'error_info'=>'请在个人信息处认证手机号'));
                return;
            }
            $data = file_get_contents("php://input");
            $data = json_decode($data,true);
            
            $GoodsDb = D('Goods');
            $OrdersDb = D('Orders');
            $goodsInfo = $GoodsDb->getGoods(array('goods_id' => $data['goods_id']));
            
            if(!$goodsInfo) {
                echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'该商品不存在'));
                return;
            }
            
            if($goodsInfo['goods_stock'] <= 0){
                echo json_encode(array('result'=>'fail','error_code'=>42042,'error_info'=>'商品已售罄，去首页逛逛吧'));
                return;
            }
            
            $AddressDb = D('Address');
            $map = array();
            $map['member_id'] = $this->memberInfo['member_id'];
            $map['address_id'] = $data['address_id'];
            $address = $AddressDb->getAddr($map);
            if(!$address){
                echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'地址不存在'));
                return;
            }
            
            $input['buyer_id'] = $this->memberInfo['member_id'];
            $input['seller_id'] = $goodsInfo['member_id'];
            $input['order_sn'] = date('YmdHis').rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9);
            $input['goods_id'] = $data['goods_id'];
            $input['group_order_id'] = (int)$data['group_order_id'] ? (int)$data['group_order_id'] : 0;
            $input['group_buy'] = $data['groupbuy'];
            
            
            $input['province_id'] = $address['province_id'];
            $input['city_id'] = $address['city_id'];
            $input['district_id'] = $address['district_id'];
            
            $input['province_name'] = $address['province'];
            $input['city_name'] = $address['city'];
            $input['district_name'] = $address['district'];
            
            $input['mobile'] = $address['mobile'];
            
            $input['receive_name'] = $address['receive_name'];
            $input['nickname'] = $this->memberInfo['nickname'];
            
            $input['order_goods'] = serialize($goodsInfo);
            

            $input['goods_amount'] = $goodsInfo['alone_price'];
            $input['order_amount'] = $goodsInfo['alone_price'];
            $input['pay_amount'] = $data['totalPrice'];
            
            $input['shipping_address'] = $address['full_address'];
            $input['shipping_amount'] = 0.00;
            $input['order_status'] = 0;
            
            $input['order_time'] = time();
            $order_id = $OrdersDb->add($input);
            
            if($order_id){
                echo json_encode(array('result'=>'ok','order_id'=>$order_id));
                return;
            }else{
                echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'创建订单失败'));
                return;
            }
            
            exit;
        }
    }   
    
    public function wxpay() {
        $order_id = I('get.order_id');
        $OrdersDb = D('Orders');
        $orderInfo = $OrdersDb->getOrder(array('order_id'=>$order_id));
        if(!$orderInfo) {
            echo json_encode(array('result'=>'fail','error_code'=>41001,'error_info'=>'订单不存在'));
            return;
        }
        
        $GoodsDb = D('Goods');
        
        $goodsInfo = $GoodsDb->getGoods(array('goods_id' => $orderInfo['goods_id']));
        
        if(!$goodsInfo) {
            echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'商品已下架或删除'));
            return;
        }
        
        if(!$orderInfo['goods_stock'] <= 0 ) {
            echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'商品已售罄，去首页逛逛吧'));
            return;
        }
        
        if($orderInfo['group_buy'] == 1) {
            $groupBuyCount = $OrdersDb->where(array('buyer_id'=>$this->memberInfo['member_id'],'group_buy'=>1,'order_status'=>array('not in',array(1,5))))->count();
            if($groupBuyCount >= $goodsInfo['limit_buy'] && $goodsInfo['limit_buy'] != 0){
                echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'该商品一人限购'.$goodsInfo['limit_buy'].'件'));
                return;
            }
        }
        
        if($orderInfo['group_buy'] == 1 && $orderInfo['group_order_id'] > 0) {
            $GroupDb = D('Group');
            $groupInfo = $GroupDb->getGroup(array('group_order_id'=>$orderInfo['group_order_id']));
            
            if(!$groupInfo){
                echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'该团不存在'));
                return;
            }
            
            if($groupInfo['status'] == 1){
                echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'该团已满员'));
                return;
            }
            
            if($groupInfo['status'] == 2){
                echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'该团已关闭'));
                return;
            }
            
            $orderMap['group_order_id'] = $groupInfo['group_order_id'];
            $orderMap['pay_sn'] = array('gt',0);
            $orderMap['pay_time'] = array('gt',0);
            $orderMap['buyer_id'] = $this->memberInfo['member_id'];
            if($OrdersDb->where($orderMap)->find()){
                echo json_encode(array('result'=>'fail','error_code'=>41002,'error_info'=>'您已加入过此团'));
                return;
            }
        }
        
        //开始生成支付信息
        $time = time();
        $pay['pay_sn'] = date('YmdHis').rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9);
        $pay['order_id'] = $orderInfo['order_id'];
        $pay['pay_amount'] = $orderInfo['pay_amount'];
        $pay['pay_start_time'] = $time;
        $pay['pay_status'] = 0;
        $PaylogDb = D('Paylog');
        $pay_id = $PaylogDb->add($pay);
        $payInfo = $PaylogDb->getPaylog(array('pay_id'=>$pay_id));
        
        if(!$payInfo) {
            echo json_encode(array('result'=>'fail','error_code'=>41001,'error_info'=>'生成支付订单失败'));
            return;
        }
        
        if($payInfo['pay_status'] == 1) {
            echo json_encode(array('result'=>'fail','error_code'=>41003,'error_info'=>'该订单已支付'));
            return;
        }
        import("@.Libary.wxpay.JsApiPay");
        $tools = new JsApiPay();
        
        $openId = $this->memberInfo['open_id'];
        $input = new WxPayUnifiedOrder();
        
        $input->SetBody(C('web_name') . "-" . $goodsInfo['cate_name']);
        $input->SetOut_trade_no($payInfo['pay_sn']);
        $input->SetTotal_fee($orderInfo['pay_amount'] * 100);
        $input->SetTime_start(date('Y-m-d'));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        
        $url = C('web_url').'wxpay_notify.php';
        $input->SetNotify_url($url);
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        
        $order = WxPayApi::unifiedOrder($input);
        $PaylogDb->where(array('pay_id'=>$payInfo['pay_id']))->save(array('prepay_id' => $order['prepay_id']));

        $jsApiParameters = $tools->GetJsApiParameters($order);
        $jsApiParameters = json_decode($jsApiParameters,true);
        
        
        $ret['param'] = $jsApiParameters;
        $ret['result'] = 'ok';
        
        
        echo json_encode($ret);
    }
    
    public function orderDel()
    {
        $order_id = I('get.id');
        $map = array('order_id' => $order_id);
        $OrderDb = D('Orders');
        $del = 1;
        $result = $OrderDb->where($map)->__set('del', $del);
        $result = $OrderDb->save();
        echo json_encode($result);
    }
    /**
     * 订单详情
     */
    public function order() {
        if($this->isPost()) {
            $order_id = I('get.order_id');
           
            $OrderDb = D('Orders');
            $orderInfo = $OrderDb->getOrder(array('order_id' => $order_id,'buyer_id' => $this->memberInfo['member_id']));
            if(!$orderInfo) {
                echo json_encode(array('result'=>'fail','error_code'=>41001,'error_info'=>'订单不存在'));
            } 
            
            if($orderInfo['pay_sn'] != '' && $orderInfo['order_status'] != 0) {
                echo json_encode(array('result'=>'fail','error_code'=>41001,'error_info'=>'该订单不可取消,请联系客服'));
            }
            
            $OrderDb->setOrderStatus($orderInfo['order_id'],5);
            
            $ret['result'] = 'ok';
            
            echo json_encode($ret);
            exit;
        }
        
        $offset = I('get.offset');
        $size = I('get.size');
        $order_status = I('get.order_status');
        
        if($order_status != '') {
            $map['order_status'] = $order_status;
            
            if($order_status == 1){
                $map['order_status'] = array('between',array('1','3'));
            }
        }
        
        $OrdersDb  =  D('Orders');
        $map['buyer_id'] = $this->memberInfo['member_id'];
        $map['del'] = 0;
        $list = $OrdersDb->where($map)->order('order_time desc')->limit($offset,$size)->select();
        
        if(!$list) {
            $ret['order_list'] = array();
        } else {
            foreach ($list as $k => $v) {
                $v['order_goods'] = unserialize($v['order_goods']);   
                $ret['order_list'][] = $v;
            }
        }
         
        $ret['result'] = 'ok';
        
        echo json_encode($ret);exit;
    }
    
    public function getSellerOrder()
    {
        $OrdersDb  =  D('Orders');
        $map['seller_id'] = $this->memberInfo['member_id'];
        $list = $OrdersDb->where($map)->order('order_time desc')->select();
        if(!$list) {
            $ret['order_list'] = array();
        } else {
            foreach ($list as $k => $v) {
                $v['order_goods'] = unserialize($v['order_goods']);   
                $ret['order_list'][] = $v;
            }
        }

        $ret['result'] = 'ok';

        echo json_encode($ret);
    }

    /**
     * 根据获取订单详情
     */
    public function getorder() {
        $order_id = I('get.order_id');
        $isSeller = I('get.isSeller');
        $OrdersDb = D('Orders');
        
        if ($isSeller == 'true')
        {
            $orderInfo = $OrdersDb->getOrder(array('order_id' => $order_id));
        }
        else
        {
            $orderInfo = $OrdersDb->getOrder(array('order_id' => $order_id,'buyer_id' => $this->memberInfo['member_id']));
        }

        if (!$orderInfo) {
            echo json_encode(array('result'=>'fail','error_code'=>41001,'error_info'=>'订单不存在'));
            return;
        }

        $imgs = unserialize($orderInfo['order_imgs']);


        $ret['order_imgs'] = $imgs;
        $orderInfo['order_goods'] = unserialize($orderInfo['order_goods']);

        $ret['goodCategorys'] = json_decode($orderInfo['order_goods']['goodCategorys'], true);
        $ret['order'] = $orderInfo;
        $ret['result'] = 'ok';

        echo json_encode($ret);
    }
    
    public function group_orders() {
        $id = I('get.id');
        
        $GroupDb = D('Group');
        $groupInfo = $GroupDb->getGroup(array('group_order_id'=>$id));
        
        if(!$groupInfo){
            echo json_encode(array('result'=>'fail','error_code'=>41001,'error_info'=>'该团不存在'));
            return;
        }
        
        $OrdersDb = D('Orders');
        
        $map = array();
        $map['group_order_id'] = $groupInfo['group_order_id'];
        $map['group_buy'] = 1;
        $map['order_status'] = array('not in','0,5');
        $orders = $OrdersDb->join(C('db_prefix') . 'member ON ' . C('db_prefix') . 'orders.buyer_id = ' . C('db_prefix') . 'member.member_id')->where($map)->order(C('db_prefix') . 'orders.group_header desc,' . C('db_prefix') . 'orders.pay_time asc')->select();
        
        foreach ($orders as $k => $v) {
            $tmp = array();
            $tmp['avatar'] = $v['headimgurl'];
            $tmp['join_time'] = $v['pay_time'];
            $tmp['nickname'] = $v['nickname'];
            $tmp['user_id'] = $v['member_id'];
            $user[] = $tmp;
        }
        
        $map = array();
        $map['group_order_id'] = $groupInfo['group_order_id'];
        $map['group_buy'] = 1;
        $map['group_header'] = 1;
        $map['order_status'] = array('not in','0,5');
        $order = $OrdersDb->join(C('db_prefix') . 'member ON ' . C('db_prefix') . 'orders.buyer_id = ' . C('db_prefix') . 'member.member_id')->where($map)->order('group_header asc,pay_time asc')->find();
        
        $order['order_goods'] = unserialize($order['order_goods']);
       
        $ret['result'] = 'ok';
        $ret['group_order'] = $groupInfo;
        $ret['group_order']['users'] = $user;
        $ret['group_order']['order'] = $order;
        $ret['group_order']['caller_id'] = $this->memberInfo['member_id'];
        echo json_encode($ret);
    }
    
    public function orders_count() {
    
        $OrdersDb  =  D('Orders');
        $map['buyer_id'] = $this->memberInfo['member_id'];
    
        $map['order_status'] = 0;
        $unpaidCount = $OrdersDb->where($map)->count();
    
    
        $map['order_status'] = array('between',array('1','3'));
        $unreceivedCount = $OrdersDb->where($map)->count();
    
    
        $ret['unpaid'] = $unpaidCount;
        $ret['unreceived'] = $unreceivedCount;
        $ret['result'] = 'ok';
    
        echo json_encode($ret);exit;
    }
    
    /**
     * 团购列表
     */
    public function groups() {
        $OrdersDb = D('Orders');
        
        $offset = I('get.offset');
        $size = I('get.size');
        $map['buyer_id'] = $this->memberInfo['member_id'];
        $map[C('db_prefix') . 'orders.group_order_id'] = array('gt',0);
        $map['group_buy'] = 1;
        $map['pay_sn'] = array('neq','');
        $map['pay_time'] = array('gt',0);
        $map['order_status'] = array(array('neq',0,array('neq',5),'AND'));
        
        $orders = $OrdersDb->join((C('db_prefix') . 'group ON ' . C('db_prefix') . 'orders.group_order_id = ' . C('db_prefix') . 'group.group_order_id'))->where($map)->limit($offset,$size)->order(C('db_prefix') . 'group.group_order_id desc')->select();
        if(!$orders) {
            $orders = array();
        }
        foreach ($orders as $k => $v) {
            $orders[$k]['order_goods'] = unserialize($v['order_goods']);
        }
        $ret['group_orders'] = $orders;
        $ret['result'] = 'ok';
        echo json_encode($ret);
    }
    
    /**
     * 取消订单
     */
    public function cancelOrder() {
        $order_id = I('get.order_id');
        
        $OrdersDb  = D('Orders');
        
        $orderInfo = $OrdersDb->getOrder(array('order_id' => $order_id,'buyer_id' => $this->memberInfo['member_id']));
        
        $OrdersDb->where(array('order_id' => $order_id,'buyer_id' => $this->memberInfo['member_id']))->save(array('order_status' => 5));
        
        $ret['result'] = 'ok';
        
        echo json_encode($ret);
    }
    
    /**
     * 页面分享回调方法
     */
    public function share() {
        if($this->isPost()) {
            $data = file_get_contents('php://input');
            $data = json_decode($data,true);
            
            $data['share_time'] = time();
            $data['member_id'] = $this->memberInfo['member_id'];
            
            D("Share")->add($data);
            
            $ret['result'] = 'ok';
            echo json_encode($ret);exit;
        }
    }
    
    /**
     * 确认发货
     */
    public function receivedOrder() {
        if($this->isPost()) {
            $order_id = I('get.order_id');
            
            D('Orders')->where(array('order_id' => $order_id))->save(array('order_status' => 4,'received_time' => time()));
            
            $ret['result'] = 'ok';
            echo json_encode($ret);
            exit;
        }
    }
    

    
    
}