<template>
  <div id="myapp">
    <router-view></router-view>
  </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    export default {
        name: 'myapp',
        data() {
            return {
                time: null
            };
        },
        mounted() {
            window.onresize = (e) => {
                if (this.time) {
                    clearTimeout(this.time);
                }
                this.time = setTimeout(() => {
                    this.onresize(e);
                }, 300)  // 效率问题， 推迟 300 ms 在执行resize
            }
        },
        methods: {
            ...mapMutations([
                'onresize'
            ])
        }
    }
</script>
<style>
  #myapp {
    width: 100%;
    height: 100%;
  }
</style>
