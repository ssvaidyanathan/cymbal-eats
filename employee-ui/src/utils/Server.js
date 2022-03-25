export async function getMenuItems() {
  console.time('getMenuItems');
  const url = process.env.VUE_APP_MENU_SERVICE_URL+"/menu/ready";
  const response = await fetch(url, {
    mode: 'cors',
    method: 'GET',
  })
  console.timeEnd('getMenuItems');
  return await response.json();
}

export async function getInventoryCounts() {
  console.time('getInventoryCounts')
  const url = process.env.VUE_APP_INVENTORY_SERVICE_URL+"/getAvailableInventory";
  //const url = 'https://spanner-inventory-service-luu7kai33a-uc.a.run.app/getAvailableInventory';
  const response = await fetch(url, {
    mode: 'cors',
    method: 'GET',
  })
  const inventoryCounts = await response.json();
  console.timeEnd('getInventoryCounts')
  return inventoryCounts.map(ic => ({
    id: ic.ItemID,
    inventory: ic.Inventory
  }));
}

export async function placeOrder(name, address, city, state, zip, orderItems) {
  const url = process.env.VUE_APP_ORDER_SERVICE_URL+"/place-order";
  //const url = 'https://order-service-luu7kai33a-uc.a.run.app/place-order';
  const payload = {name, address, city, state, zip, orderItems};
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  const respObj = await response.json();
  return respObj.orderNumber;
}

export async function createMenuItem(tagLine, itemName, itemPrice, spiceLevel) {
  const url = process.env.VUE_APP_MENU_SERVICE_URL+"/menu";
  const payload = {tagLine, itemName, itemPrice, spiceLevel};
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  const respObj = await response.json();
  return respObj;
}

export async function updateInventoryCount(menuItemId, inventoryCountChange) {
  const url = process.env.VUE_APP_INVENTORY_SERVICE_URL + '/updateInventoryItem';
  const payload = {itemID: menuItemId, inventoryChange: inventoryCountChange};
  console.log('Hitting ', url);
  console.log('Payload ', payload);
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  console.log(response);
}
