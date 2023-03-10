<script lang="ts">
import type { Component, PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { RootListIcon } from 'tdesign-icons-vue-next'
import { useAuthStore } from '@/store/modules/auth'

export default defineComponent({
  props: {
    to: {
      type: Object as PropType<Partial<RouteRecordRaw>>,
      required: false,
      default() {
        return { path: '/' }
      },
    },
    featureIcon: {
      type: Object as PropType<Component>,
      required: false,
      default: RootListIcon,
    },
    requireLogin: {
      type: Boolean,
      required: false,
      default: false,
    },
    requireAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const authStore = useAuthStore()
    const hintMsg = computed(() => {
      // TODO(whalien): add check auth logical
      if (props.requireLogin)
        return '需要读者登录以使用'
      if (props.requireAdmin)
        return '需要管理员登录以使用'
      return ''
    })

    const disableTooltip = computed(() => {
      if (props.requireLogin && authStore.userLoginStatus)
        return true
      if (props.requireAdmin && authStore.adminLoginStatus)
        return true
      return false
    })

    return {
      hintMsg,
      disableTooltip,
    }
  },
})
</script>

<template>
  <t-tooltip
    :content="hintMsg" hide-empty-popup placement="top" trigger="hover" :disabled="disableTooltip"
    theme="light"
  >
    <router-link :to="to">
      <component :is="featureIcon" size="2.2em" />
      <p>
        <slot name="desc">
          待填充功能
        </slot>
      </p>
    </router-link>
  </t-tooltip>
</template>

<style lang="scss" scoped>
a {
  display: block;
  text-decoration: none;
  text-align: center;
  color: var(--td-text-color-secondary);
  cursor: pointer;

  &:hover {
    color: var(--td-success-color-7);
  }

  &:active {
    color: var(--td-text-color-link);
  }

  svg {
    display: inline-block;
    vertical-align: middle;
  }

  p {
    font-size: 1.2em;
    padding-top: 12px;
    text-align: center;
  }
}
</style>
