<script setup>
import { inject, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { useRouter } from "vue-router";
import { i18nSidebar } from "@/i18n/View";
import { useLangStore } from "@/stores/i18n";
import { useDialogStore } from "@/stores/dialog";

const API_BASE = inject("API_BASE");

const langStore = useLangStore();
const accountStore = useAccountStore();
const dialogStore = useDialogStore();

const router = useRouter();

const navMenu = [
  {
    icon: "pi-plus-circle",
    label: i18nSidebar.navMenuCreateNewResume[langStore.lang],
    click: () => {
      dialogStore.show("create_resume");
    },
    highlight: true,
  },
  {
    icon: "pi-file",
    label: i18nSidebar.navMenuResumes[langStore.lang],
    link: { name: "dashboard" },
  },
  {
    icon: "pi-envelope",
    label: i18nSidebar.navMenuCoverLetters[langStore.lang],
    link: { name: "login" },
  },
  {
    icon: "pi-file-edit",
    label: i18nSidebar.navMenuResignationLetters[langStore.lang],
    link: { name: "login" },
  },
  {
    icon: "pi-briefcase",
    label: i18nSidebar.navMenuJobTracking[langStore.lang],
    link: { name: "login" },
  },
];

const menu = ref();
const account_dropdown_items = [
  {
    label: i18nSidebar.dropdownTitle[langStore.lang],
    items: [
      {
        label: i18nSidebar.dropdownProfile[langStore.lang],
        icon: "pi pi-user",
      },
      {
        label: i18nSidebar.dropdownSubscription[langStore.lang],
        icon: "pi pi-crown",
      },
      { separator: true },
      {
        label: i18nSidebar.dropdownLogout[langStore.lang],
        icon: "pi pi-sign-out",
        command() {
          accountStore.logout();
          router.push({ name: "login" });
        },
      },
    ],
  },
];

const toggleMenu = (event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <aside class="app-sidebar">
    <div class="container">
      <router-link :to="{ name: 'dashboard' }" class="logo">
        <img
          :src="`${API_BASE}${
            [1, 12].includes(new Date().getMonth() + 1)
              ? '/images/beresu.me.noel.svg'
              : '/images/beresu.me.svg'
          }`"
          alt="logo"
          height="50"
        />
      </router-link>
      <ul class="nav-menu">
        <li v-for="menu_item in navMenu" :key="menu_item">
          <router-link
            :to="menu_item.link"
            :class="{ highlight: menu_item.highlight }"
            v-ripple
            active-class="active"
            v-if="menu_item.link"
          >
            <i class="pi" :class="menu_item.icon"></i>
            {{ menu_item.label }}
          </router-link>
          <a
            href="#"
            :class="{ highlight: menu_item.highlight }"
            active-class="active"
            @click="menu_item.click"
            v-ripple
            v-else
          >
            <i class="pi" :class="menu_item.icon"></i>
            {{ menu_item.label }}
          </a>
        </li>
      </ul>
      <Button
        class="account-info no-bounce"
        v-if="accountStore.account"
        @click="toggleMenu"
        severity="secondary"
        variant="text"
        size="large"
      >
        <Avatar
          :image="accountStore.account.photo_url"
          size="large"
          shape="circle"
          v-if="accountStore.account.photo_url"
        />
        <Avatar
          :label="accountStore.first_letter"
          size="large"
          shape="circle"
          class="avatar-label"
          v-else
        />
        <div class="detail">
          <strong>{{ accountStore.full_name }}</strong>
          <Tag value="PREMIUM" v-if="accountStore.account.subscription"></Tag>
          <Tag value="FREE" severity="info" v-else></Tag>
        </div>
        <Menu
          ref="menu"
          :model="account_dropdown_items"
          :popup="true"
          class="account-menu"
        />
      </Button>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 300px;
  border-right: 1px solid var(--color-gray);
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .logo {
      padding: 1rem;
      height: 75px;
      display: flex;
      align-items: center;
    }
    .nav-menu {
      list-style: none;
      margin: 1.5rem 1rem;
      li {
        &:not(:last-child) {
          margin-bottom: 0.5rem;
        }
        a {
          text-decoration: none;
          display: flex;
          align-items: center;
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          color: var(--color-dark);
          font-weight: 600;
          font-size: 0.95rem;
          border: 2px solid transparent;
          /* transition: background 150ms linear; */
          .pi {
            margin-right: 1rem;
          }
          &:hover {
            background: rgba(var(--rgb-color-primary), 0.25);
          }
          &.active {
            background: rgba(var(--rgb-color-primary), 1);
            border: 2px solid rgba(0, 0, 0, 0.5);
          }
          &.highlight {
            background-color: var(--color-secondary);
            color: var(--color-primary);
            margin-bottom: 2.5rem;
            transition: all 150ms linear;
            &:hover {
              border-color: var(--color-primary);
            }
          }
        }
      }
    }
    .account-info {
      margin: auto 1rem 1rem 1rem;
      display: flex;
      align-items: center;
      text-align: left;
      .p-avatar {
        margin-right: 0.5rem;
      }
      .avatar-label {
        background-color: var(--color-primary);
      }
      .detail {
        flex: 1;
        strong {
          font-size: 1rem;
          color: var(--color-dark);
          display: block;
          margin-bottom: 0.25rem;
        }
        .p-tag {
          font-size: 0.7rem;
        }
      }
    }
  }
}
</style>

<style>
.account-menu {
  transform: translateY(-1rem);
}
</style>
