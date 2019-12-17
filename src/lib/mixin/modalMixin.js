export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.modalValue = val;
            }
        },
        modalValue: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.modalOpenTime++;
                }
            }
        }
    },
    computed: {
        isFirstOpen() {
            return this.modalOpenTime === 1;
        }
    },
    data() {
        return {
            modalOpenTime: 0,
            modalValue: false
        }
    },
    methods: {
        onOk() {
            this.onVisibleChange(false);
        },
        onVisibleChange(val) {
            this.$emit('close', val);
        }
    }
}