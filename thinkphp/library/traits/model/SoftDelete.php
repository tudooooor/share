<?php

namespace traits\model;

use think\Model;
use think\db\Query;

trait SoftDelete
{

    /**
     * åˆ¤æ–­å½“å‰�å®žä¾‹æ˜¯å�¦è¢«è½¯åˆ é™¤
     * @access public
     * @return boolean
     */
    public function trashed()
    {
        $field = $this->getDeleteTimeField();
        if (!empty($this->data[$field])) {
            return true;
        }
        return false;
    }

    /**
     * æŸ¥è¯¢è½¯åˆ é™¤æ•°æ�®
     * @access public
     * @return Query
     */
    public static function withTrashed()
    {
        $model = new static();
        $field = $model->getDeleteTimeField(true);
        return $model->getQuery();
    }

    /**
     * å�ªæŸ¥è¯¢è½¯åˆ é™¤æ•°æ�®
     * @access public
     * @return Query
     */
    public static function onlyTrashed()
    {
        $model = new static();
        $field = $model->getDeleteTimeField(true);
        return $model->getQuery()
            ->useSoftDelete($field, ['not null', '']);
    }

    /**
     * åˆ é™¤å½“å‰�çš„è®°å½•
     * @access public
     * @param bool  $force æ˜¯å�¦å¼ºåˆ¶åˆ é™¤
     * @return integer
     */
    public function delete($force = false)
    {
        if (false === $this->trigger('before_delete', $this)) {
            return false;
        }
        $name = $this->getDeleteTimeField();
        if (!$force) {
            // è½¯åˆ é™¤
            $this->data[$name] = $this->autoWriteTimestamp($name);
            $result            = $this->isUpdate()->save();
        } else {
            // åˆ é™¤æ�¡ä»¶
            $where = $this->getWhere();
            // åˆ é™¤å½“å‰�æ¨¡åž‹æ•°æ�®
            $result = $this->getQuery()->where($where)->delete();
        }

        // å…³è�”åˆ é™¤
        if (!empty($this->relationWrite)) {
            foreach ($this->relationWrite as $key => $name) {
                $name  = is_numeric($key) ? $name : $key;
                $model = $this->getAttr($name);
                if ($model instanceof Model) {
                    $model->delete($force);
                }
            }
        }

        $this->trigger('after_delete', $this);
        // æ¸…ç©ºåŽŸå§‹æ•°æ�®
        $this->origin = [];
        return $result;
    }

    /**
     * åˆ é™¤è®°å½•
     * @access public
     * @param mixed $data ä¸»é”®åˆ—è¡¨ æ”¯æŒ�é—­åŒ…æŸ¥è¯¢æ�¡ä»¶
     * @param bool  $force æ˜¯å�¦å¼ºåˆ¶åˆ é™¤
     * @return integer æˆ�åŠŸåˆ é™¤çš„è®°å½•æ•°
     */
    public static function destroy($data, $force = false)
    {
        // åŒ…å�«è½¯åˆ é™¤æ•°æ�®
        $query = self::withTrashed();
        if (is_array($data) && key($data) !== 0) {
            $query->where($data);
            $data = null;
        } elseif ($data instanceof \Closure) {
            call_user_func_array($data, [ & $query]);
            $data = null;
        } elseif (is_null($data)) {
            return 0;
        }

        $resultSet = $query->select($data);
        $count     = 0;
        if ($resultSet) {
            foreach ($resultSet as $data) {
                $result = $data->delete($force);
                $count += $result;
            }
        }
        return $count;
    }

    /**
     * æ�¢å¤�è¢«è½¯åˆ é™¤çš„è®°å½•
     * @access public
     * @param array $where æ›´æ–°æ�¡ä»¶
     * @return integer
     */
    public function restore($where = [])
    {
        $name = $this->getDeleteTimeField();
        if (empty($where)) {
            $pk         = $this->getPk();
            $where[$pk] = $this->getData($pk);
        }
        // æ�¢å¤�åˆ é™¤
        return $this->getQuery()
            ->useSoftDelete($name, ['not null', ''])
            ->where($where)
            ->update([$name => null]);
    }

    /**
     * æŸ¥è¯¢é»˜è®¤ä¸�åŒ…å�«è½¯åˆ é™¤æ•°æ�®
     * @access protected
     * @param Query $query æŸ¥è¯¢å¯¹è±¡
     * @return void
     */
    protected function base($query)
    {
        $field = $this->getDeleteTimeField(true);
        $query->useSoftDelete($field);
    }

    /**
     * èŽ·å�–è½¯åˆ é™¤å­—æ®µ
     * @access public
     * @param bool  $read æ˜¯å�¦æŸ¥è¯¢æ“�ä½œ å†™æ“�ä½œçš„æ—¶å€™ä¼šè‡ªåŠ¨åŽ»æŽ‰è¡¨åˆ«å��
     * @return string
     */
    protected function getDeleteTimeField($read = false)
    {
        $field = property_exists($this, 'deleteTime') && isset($this->deleteTime) ? $this->deleteTime : 'delete_time';
        if (!strpos($field, '.')) {
            $field = '__TABLE__.' . $field;
        }
        if (!$read && strpos($field, '.')) {
            $array = explode('.', $field);
            $field = array_pop($array);
        }
        return $field;
    }
}
