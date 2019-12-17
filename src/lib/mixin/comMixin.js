export default {
    methods: {
        /**
         * 获取单个数据字典
         * @param type [String]
         * @param key [String]
         */
        getDict(type, key, callback) {
            this.$http({
                method: 'get',
                url: '/dict/getListByType',
                params: {
                    type: type
                }
            }).then(res => {
                if(res.code) {
                    this[key] = res.data;
                }
                if (callback) {
                    callback();
                }
            })
        },
        /**
         * 获取字典列表, 自动赋值
         * @param list [Array]
         * @return null
         */
        getDicts(list, callback) {
            this.$http({
                method: 'get',
                url: '/dict/getListByTypes',
                params: {
                    types: list.join(',')
                }
            }).then(res => {
                if(res.code === 'SUCCESS') {
                    list.forEach(v => {
                        this[`dict_${v}`] = res.data[v] || [];
                    });
                }
                if (callback) {
                    callback();
                }
            });
        },

        /**
         * 转化时间格式
         * @param value 11225555421
         * @param format ps: 'YYYY-MM-DD HH:mm:ss'
         * @returns {string}
         */
        timeFormat(value, format) {
            format = format || 'YYYY-MM-DD';
            return value ? this.$moment(value).format(format) : '';
        },

        //

        /**
         * 获取附件列表
         * @param relationId 关联ID
         * @param fileType 文件类别
         * @return []
         */
        getFilesList(relationId, fileType) {
            return new Promise((resolve, reject) => {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: relationId,
                        fileType: fileType
                    }
                }).then(res => {
                    if(res.code === 'SUCCESS') {
                        resolve(res.data || []);
                    }
                    else {
                        reject(res);
                    }
                });
            });

        }
    }
}