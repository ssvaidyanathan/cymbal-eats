<template>
  <q-layout view="hhh lpr fff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="restaurant"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Kitchen
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-page-container>

      <div class="q-gutter-md q-pa-md">

        <q-list
          bordered
          separator
        >
          <q-item
            v-for="order in orders"
            :key="order.orderNumber"
            clickable
            v-ripple
            :active="activeOrder==order"
            @click="activeOrder=order"
            active-class="active-order"
          >
            <q-item-section>
              {{ order.orderNumber }}
            </q-item-section>
            <q-item-section>
              {{ order.age }}
            </q-item-section>
            <q-item-section>
              {{ order.status }}
            </q-item-section>
          </q-item>
        </q-list>

        <hr>

        <q-card
          v-if="activeOrder.orderItems"
          class="q-pa-lg q-gutter-md"
        >
          <OrderView
            :items="activeOrder.orderItems"
            :allowdelete="false"
          />
          <q-btn
            color="red"
            label="Cancel &amp; refund"
            @click="cancelOrder(activeOrder.orderNumber)"
          />
          <q-btn
            v-if="activeOrder.status=='New'"
            color="primary"
            label="Start preparing"
            @click="updateOrderStatus(activeOrder.orderNumber, 'Being prepared')"
          />
          <q-btn
            v-if="activeOrder.status=='Being prepared'"
            color="primary"
            label="Ready for pickup"
            @click="updateOrderStatus(activeOrder.orderNumber, 'Ready for pickup')"
          />
          <q-btn
            v-if="activeOrder.status=='Ready for pickup'"
            color="primary"
            label="Picked up"
            @click="updateOrderStatus(activeOrder.orderNumber, 'Picked up')"
          />
        </q-card>

      </div>

    </q-page-container>
  </q-layout>
</template>

<script setup>

  import { ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import { useTimeAgo } from '@vueuse/core';
  import { query, orderBy, doc, deleteDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
  import OrderView from '../components/OrderView.vue';
  import * as Firestore from '../utils/Firestore.js';
  import * as Server from '../utils/Server.js';

  const store = useStore();
  const router = useRouter();
  const route = useRoute();

  const orders = ref([]);
  const activeOrder = ref({});

  onMounted(async () => {
    const db = await Firestore.getDb();
    const q = query(collection(db, 'orders'), orderBy('placedAt', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      orders.value = [];
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        order.age = useTimeAgo(order.placedAt.seconds * 1000);
        orders.value.push(order);
      });
    });
  })

  async function cancelOrder(orderNumber) {
    if (confirm(`Are you sure you want to cancel order ${orderNumber}?`)) {
      try {
        await Server.cancelOrder(orderNumber);
      }
      catch (ex) {
        alert(ex);
      }
    }
  }

  async function updateOrderStatus(orderNumber, newStatus) {
    try {
      await Server.updateOrderStatus(orderNumber, newStatus);
    }
    catch (ex) {
      alert(ex);
    }
  }

</script>

<style lang="sass">
  .active-order
    color: white
    background: #F2C037
</style>