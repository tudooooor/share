<?php
/*
* 系统公共类
*/
$info_img = '';

class CmsAction extends Action{
    
     

    public function _initialize() {
		/*
		* 载入各种扩展
		*/
		//import("ORG.Util.Image");	//图像操作类库
		Load('extend');		//Think扩展函数库
    }
 
    public function upload1()
    {
        $ret = $this->upload();


        echo json_encode($ret);
    }

    public function upload3()
    {
        global $info_img;
        $this->data['image_url'] = $info_img;
        $temp = json_decode($_POST['goods_imgs']);
        $tempDetail = json_decode($_POST['goods_imgs_detail']);
        $serialTemp = serialize($temp);
        $serialTempDetail = serialize($tempDetail);
        $GoodsDb = D('Goods');
        if($GoodsDb->create()) {
            $GoodsDb->__set('image_url', $temp[0]);
            $GoodsDb->__set('goods_imgs', $serialTemp);
            $GoodsDb->__set('goods_imgs_detail', $serialTempDetail);
            $GoodsDb->__set('member_id', $this->memberInfo['member_id']);
            $goodId = $GoodsDb->save();
            // if($goodId) {
            //     $this->success('添加成功',U('Admin/Goods/index'));
            // } else {
            //     $this->error('添加失败',U('Admin/Goods/index'));
            // }
        } else {
            $this->error($GoodsDb->getError());
        }
    }

    public function uploadOrderImg()
    {
        global $info_img;
        $this->data['image_url'] = $info_img;
        $temp = json_decode($_POST['order_imgs']);
       
        $serialTemp = serialize($temp);
        $OrdersDb = D('Orders');

        if($OrdersDb->create()) {
            $OrdersDb->__set('order_imgs', $serialTemp);
            $result = $OrdersDb->save();
        } else {
            $this->error($OrdersDb->getError());
        }
    }
    public function addGoodWhenAdd($goods_id) {

        $goodsArray;
        if ($this->memberInfo['goods'] == "")
        {
            $goodsArray = array();
        }
        else
        {
            $goodsArray = unserialize($this->memberInfo['goods']);           
        }

        $temp = array_push($goodsArray, $goods_id);
        $goodsArray = array_unique($goodsArray);
        
        $serialTemp = serialize($goodsArray);
        $this->MemberDb->__set('goods', $serialTemp);
        $result = $this->MemberDb->save();
        //echo json_encode($result);
    }
    public function upload2()
    {
        //$ret = $this->upload();
        global $info_img;
        $this->data['image_url'] = $info_img;
        $temp = json_decode($_POST['goods_imgs']);
	$tempDetail = json_decode($_POST['goods_imgs_detail']);
        $serialTemp = serialize($temp);
	$serialTempDetail = serialize($tempDetail);
        $GoodsDb = D('Goods');
        
        if($GoodsDb->create()) {
            $GoodsDb->__set('image_url', $temp[0]);
            $GoodsDb->__set('goods_imgs', $serialTemp);
	    $GoodsDb->__set('goods_imgs_detail', $serialTempDetail);
            $GoodsDb->__set('member_id', $this->memberInfo['member_id']);
            $goodId = $GoodsDb->add();
	    $ret['goods_id'] = $goodId;
	    $this->addGoodWhenAdd($this->memberInfo['member_id']);
            echo json_encode($ret);  
            // if($goodId) {
            //     $this->success('添加成功',U('Admin/Goods/index'));
            // } else {
            //     $this->error('添加失败',U('Admin/Goods/index'));
            // }
        } else {
            $this->error($GoodsDb->getError());
        }

        //echo json_encode($ret);
    }

    /**
     * 公共上传
     */
    public function upload() {
        import("@.Libary.oss.OssClient");
        import('ORG.Net.UploadFile');
        $upload_config = C('upload_config');
        
        $dir_name = empty($_GET['dir']) ? 'image' : trim($_GET['dir']);
        
        $upload_config['savePath'] .= $dir_name.'/';
        $upload = new UploadFile($upload_config);// 实例化上传类
        if(!$upload->upload()) {// 上传错误提示错误信息
            return array('error'=>1,'message'=>$upload->getErrorMsg());
        } else {// 上传成功 获取上传文件信息
            $info =  $upload->getUploadFileInfo();
        }
        

       
 
        //上传成功后处理
        $ossConfig = C('yun_oss');
        foreach($info as $k=>$v){
            if($ossConfig['oss_open'] == 1) {
                $oss = new OssClient($ossConfig['access_key_id'], $ossConfig['access_key_secret'], $ossConfig['endpoint']);
                $res = $oss->uploadFile($ossConfig['bucket'], 'Uploads/'.$dir_name.'/' . $v['savename'], $v['savepath'] . $v['savename']);

                if ($res) {
                    $data['oss'] = 1;
                    $data['attach_url'] = $res['info']['url'];
                    if ($ossConfig['is_delete'] == 1) {
                        @unlink($v['savepath'] . $v['savename']);
                    }
                } else {
                    $data['attach_url'] = C('web_url').  'Uploads/' . $dir_name.'/' . $v['savename'];
                    $data['oss'] = 0;
                }
        
                $data['time'] = time();
                $attach_id = M('Attachment')->add($data);
                $attach_array[] = $attach_id;
                $attach_url[] = $data['attach_url'];
                unset($data);
            }else{
                $data['oss'] = 0;
                $data['attach_url'] = C('web_url'). 'Uploads/' . $dir_name.'/' . $v['savename'];
                global $info_img;
                $info_img = $data['attach_url'];
                $data['time'] = time();
                $attach_id = M('Attachment')->add($data);
                $attach_array[] = $attach_id;
                $attach_url[] = $data['attach_url'];
                unset($data);
            }
        }

        return array('error'=>0,'attach'=>$attach_array,'url'=>$attach_url[0],'url_arr'=>$attach_url);
        
    }
	
}
