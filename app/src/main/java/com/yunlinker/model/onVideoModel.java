package com.yunlinker.model;

/**
 * Created by Administrator on 2019/5/5/005.
 */

public class onVideoModel {

    /**
     * code : 1
     * curPage : 0
     * data : {"status":"200","AccessKeyId":"STS.NK5C2sWSd7Ywd72tHwMtNbwrR","AccessKeySecret":"DzYnKfDFYmfoGLng9VLwD4neWpLSsANqtnzk8SjVKVVK","SecurityToken":"CAIS/wF1q6Ft5B2yfSjIr4iACIjHuoxFgJucZhGDkEgiQftijbLZsDz2IH9NfXBgBeges/01n2tZ7fsflqZpTJtIfkHfdsp36LJe9A75+zpvZgzwv9I+k5SANTW5LXyShb3zAYjQSNfaZY3aCTTtnTNyxr3XbCirW0ffX7SClZ9gaKZ4PGSmajYURq0hRG1YpdQdKGHaONu0LxfumRCwNkdzvRdmgm4NgsbWgO/ks0uA1Q2nkbVO+N2tfcb7MvMBZskvD42Hu8VtbbfE3SJq7BxHybx7lqQs+02c4YjEWgkNu03barCPqYw0cVJjA6E+Gr9Zqub7med/vuHDZBwrScas64oagAEhDXdW/BeMG6qYMCwRq6EWDhzcBFb2abQIEDe5pVVBzVmSQzhgbSBe5iqvzudtOEzJAL6ivgSu9tuN10KpIwCMrxbIP6N7aWmoU4lRZ+qwRLVlT+6lgTU8aQFjqLbyzDGwk17KXLRHy+n4pP3TLy5pC7MUgRwq3KWsc8j2r4Oklg==","Expiration":"2019-05-05T06:32:32Z"}
     * msg :
     * pageSize : 0
     * totalCount : 0
     */

    private int code;
    private int curPage;
    private DataBean data;
    private String msg;
    private int pageSize;
    private int totalCount;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public int getCurPage() {
        return curPage;
    }

    public void setCurPage(int curPage) {
        this.curPage = curPage;
    }

    public DataBean getData() {
        return data;
    }

    public void setData(DataBean data) {
        this.data = data;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public static class DataBean {
        /**
         * status : 200
         * AccessKeyId : STS.NK5C2sWSd7Ywd72tHwMtNbwrR
         * AccessKeySecret : DzYnKfDFYmfoGLng9VLwD4neWpLSsANqtnzk8SjVKVVK
         * SecurityToken : CAIS/wF1q6Ft5B2yfSjIr4iACIjHuoxFgJucZhGDkEgiQftijbLZsDz2IH9NfXBgBeges/01n2tZ7fsflqZpTJtIfkHfdsp36LJe9A75+zpvZgzwv9I+k5SANTW5LXyShb3zAYjQSNfaZY3aCTTtnTNyxr3XbCirW0ffX7SClZ9gaKZ4PGSmajYURq0hRG1YpdQdKGHaONu0LxfumRCwNkdzvRdmgm4NgsbWgO/ks0uA1Q2nkbVO+N2tfcb7MvMBZskvD42Hu8VtbbfE3SJq7BxHybx7lqQs+02c4YjEWgkNu03barCPqYw0cVJjA6E+Gr9Zqub7med/vuHDZBwrScas64oagAEhDXdW/BeMG6qYMCwRq6EWDhzcBFb2abQIEDe5pVVBzVmSQzhgbSBe5iqvzudtOEzJAL6ivgSu9tuN10KpIwCMrxbIP6N7aWmoU4lRZ+qwRLVlT+6lgTU8aQFjqLbyzDGwk17KXLRHy+n4pP3TLy5pC7MUgRwq3KWsc8j2r4Oklg==
         * Expiration : 2019-05-05T06:32:32Z
         */

        private String status;
        private String AccessKeyId;
        private String AccessKeySecret;
        private String SecurityToken;
        private String Expiration;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getAccessKeyId() {
            return AccessKeyId;
        }

        public void setAccessKeyId(String AccessKeyId) {
            this.AccessKeyId = AccessKeyId;
        }

        public String getAccessKeySecret() {
            return AccessKeySecret;
        }

        public void setAccessKeySecret(String AccessKeySecret) {
            this.AccessKeySecret = AccessKeySecret;
        }

        public String getSecurityToken() {
            return SecurityToken;
        }

        public void setSecurityToken(String SecurityToken) {
            this.SecurityToken = SecurityToken;
        }

        public String getExpiration() {
            return Expiration;
        }

        public void setExpiration(String Expiration) {
            this.Expiration = Expiration;
        }
    }
}
