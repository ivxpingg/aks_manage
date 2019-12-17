export default {
    watch: {
        'searchParams.current'() {
            this.getData();
        },
        'searchParams.condition': {
            deep: true,
            handler() {
                this.getData();
            }
        }
    },
    methods: {
        /**
         * 分页控件-切换页面
         * @param current
         */
        onPageChange(current) {
            this.searchParams.current = current;
        },
        onPageSizeChange(size) {
            this.searchParams.size = size;
        }
    }
}