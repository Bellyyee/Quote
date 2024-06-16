let items = [];
let unitPrice = 0; // 全局变量，用于存储每体积单价
let needWoodenCrate = false;
let needSkid = false;
let currentUnit = 'm³'; // 默认单位

document.getElementById('unitPrice').addEventListener('input', function() {
    setUnitPrice();
    updateItemsTable();
    updateTotalVolume();
    updateTotalPrice();
    updateFinalTotalPrice();
});

function setUnit(unit) {
    const unitPriceInput = document.getElementById('unitPrice');
    let currentUnitPrice = parseFloat(unitPriceInput.value);

    if (!isNaN(currentUnitPrice)) {
        currentUnitPrice = unit === 'm³' ? currentUnitPrice : currentUnitPrice;
        unitPriceInput.value = currentUnitPrice.toFixed(2); // 更新输入框中的单价
    } else {
        unitPriceInput.value = ''; // 保持为空
    }

    currentUnit = unit;
    document.getElementById('unitM3').classList.toggle('active', unit === 'm³');
    document.getElementById('volumeUnitLabel').textContent = unit;
    document.getElementById('totalVolumeUnitLabel').textContent = unit;
    document.getElementById('totalVolumeUnit').textContent = unit;
    document.getElementById('unitPriceLabel').textContent = `每體積單價 (元/${unit}):`; // 更新单价标签
    updateItemsTable();
    updateTotalVolume();
    updateTotalPrice(); // 更新总价
    updateFinalTotalPrice(); // 更新最终总价
}

function setUnitPrice() {
    unitPrice = parseFloat(document.getElementById('unitPrice').value) || 0;
}

function selectItem(itemType) {
    let itemName = '';
    let dimensions = {};

    // 重置木箱和唧底选项
    needWoodenCrate = false;
    needSkid = false;
    document.getElementById('toggleWoodenCrate').classList.remove('active');
    document.getElementById('woodenCratePriceWrapper').style.display = 'none';
    document.getElementById('skidOption').style.display = 'none';
    document.getElementById('toggleSkid').classList.remove('active');

    switch (itemType) {
        case 'S':
            itemName = 'S 箱';
            dimensions = { length: 48, width: 30, height: 36 };
            break;
        case 'M':
            itemName = 'M 箱';
            dimensions = { length: 56, width: 36, height: 41 };
            break;
        case 'L':
            itemName = 'L 箱';
            dimensions = { length: 52, width: 52, height: 52 };
            break;
        case 'D':
            itemName = 'D 箱';
            dimensions = { length: 89, width: 52, height: 27 };
            break;
        case 'uprightPiano':
            itemName = 'Upright Piano';
            dimensions = { length: 158, width: 68, height: 144 }; // 更新为新的尺寸
            // 自动选择需要木箱和需要唧底
            needWoodenCrate = true;
            needSkid = true;
            document.getElementById('toggleWoodenCrate').classList.add('active');
            document.getElementById('woodenCratePriceWrapper').style.display = 'inline';
            document.getElementById('skidOption').style.display = 'block';
            document.getElementById('toggleSkid').classList.add('active');
            break;
        case 'custom':
            itemName = '自訂物品';
            dimensions = { length: '', width: '', height: '' };
            break;
        default:
            return;
    }

    document.getElementById('itemName').value = itemName;
    document.getElementById('length').value = dimensions.length;
    document.getElementById('width').value = dimensions.width;
    document.getElementById('height').value = dimensions.height;

    document.getElementById('itemName').readOnly = false;
    document.getElementById('length').readOnly = false;
    document.getElementById('width').readOnly = false;
    document.getElementById('height').readOnly = false;
}

function toggleNeed(type) {
    if (type === 'woodenCrate') {
        needWoodenCrate = !needWoodenCrate;
        document.getElementById('toggleWoodenCrate').classList.toggle('active', needWoodenCrate);
        document.getElementById('woodenCratePriceWrapper').style.display = needWoodenCrate ? 'inline' : 'none'; // 显示或隐藏标签和输入框
        document.getElementById('woodenCratePrice').required = needWoodenCrate; // 设置为必填
        // 如果选择了需要木箱，显示唧底选项
        document.getElementById('skidOption').style.display = needWoodenCrate ? 'block' : 'none';
        // 如果取消了木箱选择，重置唧底选项
        if (!needWoodenCrate) {
            needSkid = false;
            document.getElementById('toggleSkid').classList.remove('active');
            document.getElementById('woodenCratePrice').value = 0; // 重置木箱价格
            document.getElementById('woodenCratePrice').required = false; // 取消必填
        }
    } else if (type === 'skid') {
        needSkid = !needSkid;
        document.getElementById('toggleSkid').classList.toggle('active', needSkid);
    }
}

function updateWoodenCratePrice() {
    updateFinalTotalPrice(); // 更新总价
}

function incrementQuantity() {
    const quantityInput = document.getElementById('quantity');
    const quantityRange = document.getElementById('quantityRange');
    if (quantityInput.value < 100) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        quantityRange.value = quantityInput.value;
    }
}

function decrementQuantity() {
    const quantityInput = document.getElementById('quantity');
    const quantityRange = document.getElementById('quantityRange');
    if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
        quantityRange.value = quantityInput.value;
    }
}

function syncQuantity(value) {
    document.getElementById('quantity').value = value;
}

function addItem() {
    // 检查是否已填写每体积单价
    const unitPriceInput = document.getElementById('unitPrice');
    if (!unitPriceInput.value) {
        alert(`請填寫每體積單價 (元/${currentUnit})`);
        unitPriceInput.focus();
        return;
    }

    // 如果需要木箱，检查木箱价格是否已填写且大于0
    if (needWoodenCrate) {
        const woodenCratePriceInput = document.getElementById('woodenCratePrice');
        if (!woodenCratePriceInput.value || parseFloat(woodenCratePriceInput.value) <= 0) {
            alert('請填寫木箱價錢，並且需要大於0');
            woodenCratePriceInput.focus();
            return;
        }
    }

    // 获取表单数据
    const itemName = document.getElementById('itemName').value;
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const quantity = parseInt(document.getElementById('quantity').value) || 1; // 默认为1件
    const woodenCratePrice = needWoodenCrate ? parseFloat(document.getElementById('woodenCratePrice').value) || 0 : 0; // 获取木箱价格

    // 获取并设置每体积单价
    unitPrice = parseFloat(unitPriceInput.value);

    // 根据是否需要木箱调整尺寸
    let finalLength = length;
    let finalWidth = width;
    let finalHeight = height;

    if (needWoodenCrate) {
        // 需要木箱，长宽加5cm，高度加5cm
        finalLength += 5;
        finalWidth += 5;
        finalHeight += 5;

        if (needSkid) {
            // 需要唧底，高度再加7.5cm
            finalHeight += 7.5;
        }
    }

    // 计算体积 (m³)
    const volumeM = (finalLength * finalWidth * finalHeight) / 1000000;

    // 检查是否已经存在相同类型的箱子 (仅适用于 S、M、L、D 箱)
    const mergeableItems = ['S 箱', 'M 箱', 'L 箱', 'D 箱'];
    const existingItemIndex = items.findIndex(item => item.itemName === itemName && mergeableItems.includes(item.itemName));

    if (existingItemIndex !== -1) {
        // 更新已存在的箱子的数量和总价
        items[existingItemIndex].quantity += quantity;
        items[existingItemIndex].volumeM += volumeM * quantity;
        items[existingItemIndex].itemTotalPrice += (volumeM * unitPrice * quantity) + woodenCratePrice;
    } else {
        // 添加新的物品到列表
        const item = { 
            itemName, 
            quantity, 
            length, 
            width, 
            height, 
            unitPrice, 
            itemTotalPrice: (volumeM * unitPrice * quantity) + woodenCratePrice, 
            volumeM: volumeM * quantity, 
            needWoodenCrate, 
            needSkid,
            woodenCratePrice // 添加木箱价格
        };
        items.push(item);
    }

    // 如果添加的是 "Upright Piano"，自动设置一次性收费 "Piano Surcharge" 为 $3500
    if (itemName === 'Upright Piano') {
        document.getElementById('pianoSurcharge').value = 3500;
    }

    // 更新物品表格
    updateItemsTable();

    // 更新总体积和总价
    // updateTotalVolume();
    // updateTotalPrice();
    updateFinalTotalPrice();

    // 清空表单
    document.getElementById('itemName').value = '';
    document.getElementById('quantity').value = '1'; // 默认为1件
    document.getElementById('length').value = '';
    document.getElementById('width').value = '';
    document.getElementById('height').value = '';
    needWoodenCrate = false;
    needSkid = false;
    document.getElementById('toggleWoodenCrate').classList.remove('active');
    document.getElementById('toggleSkid').classList.remove('active');
    document.getElementById('skidOption').style.display = 'none';
    document.getElementById('woodenCratePriceWrapper').style.display = 'none'; // 隐藏标签和输入框
    document.getElementById('woodenCratePrice').value = 0;
}

function deleteItem(index) {
    const item = items[index];
    items.splice(index, 1);

    // 如果删除的是 "Upright Piano"，自动减去一次性收费 "Piano Surcharge" $3500
    if (item.itemName === 'Upright Piano') {
        document.getElementById('pianoSurcharge').value = 0;
    }

    updateItemsTable();
    // updateTotalVolume();
    // updateTotalPrice();
    updateFinalTotalPrice();
}

function updateItemsTable() {
    const itemsBody = document.getElementById('itemsBody');
    itemsBody.innerHTML = '';

    let totalVolume = 0;
    let totalPrice = 0;

    items.forEach((item, index) => {
        const row = document.createElement('tr');
        const itemVolume = item.volumeM / item.quantity;
        totalVolume += item.volumeM;
        totalPrice += item.itemTotalPrice;

        row.innerHTML = `
            <td>${item.itemName}</td>
            <td>${item.quantity}</td>
            <td>${item.length}</td>
            <td>${item.width}</td>
            <td>${item.height}</td>
            <td>${item.needWoodenCrate ? '木箱' : ''}</td>
            <td>${item.needSkid ? '唧底' : ''}</td>
            <td>${item.woodenCratePrice ? item.woodenCratePrice.toFixed(2) : ''}</td>
            <td>${itemVolume.toFixed(4)}</td>
            <td>${item.volumeM.toFixed(4)}</td>
            <td>${item.itemTotalPrice.toFixed(2)}</td>
            <td><button type="button" class="delete-button" onclick="deleteItem(${index})">刪除</button></td>
        `;
        itemsBody.appendChild(row);
    });

    // 添加总计行
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td colspan="9" style="text-align: right;"><strong>總計:</strong></td>
        <td>
            <strong>${totalVolume.toFixed(4)} m³</strong>
            <p id="volumeWarning" class="volume-warning" style="display: none; color: red; font-size: 0.9em;">總體積少於3m³</p>
        </td>
        <td><strong>${totalPrice.toFixed(2)} 元</strong></td>
        <td></td>
    `;
    itemsBody.appendChild(totalRow);

    const volumeWarningElement = document.getElementById('volumeWarning');
    if (totalVolume < 3) {
        volumeWarningElement.style.display = 'block';
    } else {
        volumeWarningElement.style.display = 'none';
    }

    updateFinalTotalPrice();
}

function updateTotalVolume() {
    // 隐藏總體積部分，不再更新此内容
    // const totalVolumeElement = document.getElementById('totalVolume');
    // const totalVolume = items.reduce((acc, item) => acc + item.volumeM, 0);
    // totalVolumeElement.textContent = totalVolume.toFixed(4);

    const volumeWarningElement = document.getElementById('volumeWarning');
    if (items.reduce((acc, item) => acc + item.volumeM, 0) < 3) {
        volumeWarningElement.style.display = 'block';
    } else {
        volumeWarningElement.style.display = 'none';
    }
}

function updateTotalPrice() {
    // 隐藏物品總價部分，不再更新此内容
    // const totalPriceElement = document.getElementById('totalPrice');
    // const totalPrice = items.reduce((acc, item) => acc + item.itemTotalPrice, 0);
    // totalPriceElement.textContent = totalPrice.toFixed(2);
}

function updateFinalTotalPrice() {
    const finalTotalPriceElement = document.getElementById('finalTotalPrice');
    const totalPrice = items.reduce((acc, item) => acc + item.itemTotalPrice, 0);

    const documentFee = parseFloat(document.getElementById('documentFee').value) || 0;
    const customClearance = parseFloat(document.getElementById('customClearance').value) || 0;
    const additionalFee = parseFloat(document.getElementById('additionalFee').value) || 0;
    const pianoSurcharge = parseFloat(document.getElementById('pianoSurcharge').value) || 0;

    const finalTotalPrice = totalPrice + documentFee + customClearance + additionalFee + pianoSurcharge;
    finalTotalPriceElement.textContent = finalTotalPrice.toFixed(2);
}

// 初始化设置
function initialize() {
    // 设置每体积单价
    setUnitPrice(); 
    // 初始化时更新总价
    updateFinalTotalPrice(); 
    // 设置默认单位
    setUnit('m³');

    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('quoteDate').value = today;
}

// 调用初始化函数
initialize();