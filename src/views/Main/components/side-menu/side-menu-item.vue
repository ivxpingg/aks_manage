<template>
    <Submenu :name="`${parentName}`">
        <template slot="title">
            <Icon :type="parentItem.icon"/>
            <span>{{ showTitle(parentItem) }}</span>
        </template>
        <template v-for="item in children">
            <template v-if="item.children && item.children.length === 1">
                <side-menu-item
                        v-if="showChildren(item)"
                        :key="`menu-${item.name}`"
                        :parent-item="item"></side-menu-item>
                <menu-item v-else
                           :name="getNameOrHref(item, true)"
                           :key="`menu-${item.children[0].name}`">
                    <!--<Icon :type="item.children[0].icon || ''" />-->
                    <vCommonIcon :type="item.children[0].icon || ''"/>
                    <span>{{ showTitle(item.children[0]) }}</span>
                </menu-item>
            </template>
            <template v-else>
                <side-menu-item
                        v-if="showChildren(item)"
                        :key="`menu-${item.name}`"
                        :parent-item="item"></side-menu-item>
                <menu-item v-else
                           :name="getNameOrHref(item)"
                           :key="`menu-${item.name}`">
                    <!--<Icon :type="item.icon || ''" />-->
                    <vCommonIcon :type="item.icon || ''"/>
                    <span>{{ showTitle(item) }}</span></menu-item>
            </template>
        </template>
    </Submenu>
</template>

<script>
    import mixin from './mixin';
    import itemMixin from './item-mixin';
    import vCommonIcon from '@/components/commonIcon/commonIcon';
    export default {
        name: 'side-menu-item',
        mixins: [mixin, itemMixin],
        components: {vCommonIcon},
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .side-menu-item-container {
    }
</style>