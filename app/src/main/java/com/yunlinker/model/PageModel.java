package com.yunlinker.model;

import java.util.List;

public class PageModel {

    /**
     * code : 1
     * data : [{"adtype":"1","itemid":"","face":"img/2019-08/pcxrA34Gtjfe.jpeg","adname":"启动页广告",
     * "orderindex":"3","postion":"9","enable":"1","subdate":"2019-08-26 11:00:10",
     * "advertid":"12","Url":""}]
     * msg :
     */

    private int code;
    private String msg;
    private List<DataBean> data;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public List<DataBean> getData() {
        return data;
    }

    public void setData(List<DataBean> data) {
        this.data = data;
    }

    public static class DataBean {
        /**
         * adtype : 1
         * itemid :
         * face : img/2019-08/pcxrA34Gtjfe.jpeg
         * adname : 启动页广告
         * orderindex : 3
         * postion : 9
         * enable : 1
         * subdate : 2019-08-26 11:00:10
         * advertid : 12
         * Url :
         */

        private String adtype;
        private String itemid;
        private String face;
        private String adname;
        private String orderindex;
        private String postion;
        private String enable;
        private String subdate;
        private String advertid;
        private String Url;

        public String getAdtype() {
            return adtype;
        }

        public void setAdtype(String adtype) {
            this.adtype = adtype;
        }

        public String getItemid() {
            return itemid;
        }

        public void setItemid(String itemid) {
            this.itemid = itemid;
        }

        public String getFace() {
            return face;
        }

        public void setFace(String face) {
            this.face = face;
        }

        public String getAdname() {
            return adname;
        }

        public void setAdname(String adname) {
            this.adname = adname;
        }

        public String getOrderindex() {
            return orderindex;
        }

        public void setOrderindex(String orderindex) {
            this.orderindex = orderindex;
        }

        public String getPostion() {
            return postion;
        }

        public void setPostion(String postion) {
            this.postion = postion;
        }

        public String getEnable() {
            return enable;
        }

        public void setEnable(String enable) {
            this.enable = enable;
        }

        public String getSubdate() {
            return subdate;
        }

        public void setSubdate(String subdate) {
            this.subdate = subdate;
        }

        public String getAdvertid() {
            return advertid;
        }

        public void setAdvertid(String advertid) {
            this.advertid = advertid;
        }

        public String getUrl() {
            return Url;
        }

        public void setUrl(String Url) {
            this.Url = Url;
        }
    }
}
