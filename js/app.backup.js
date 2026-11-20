
// ==================================
// SmartList 購物清單管理
// ==================================

// 取得 HTML 元素
const addListBtn = document.getElementById("addListBtn");
const listModal = document.getElementById("listModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");
const listForm = document.getElementById("listForm");
const shoppingList = document.getElementById("shoppingList");
const listCount = document.getElementById("listCount");

// 表單欄位
const listName = document.getElementById("listName");
const listDate = document.getElementById("listDate");
const listBudget = document.getElementById("listBudget");

// ==================================
// 讀取儲存的清單
// ==================================

const defaultLists = [
    {
        id: 1,
        name: "本週家庭採買",
        date: "2026-11-20",
        budget: 2000,
        spent: 1250,
        total: 5,
        purchased: 3
    },
    {
        id: 2,
        name: "居家用品補貨",
        date: "2026-11-19",
        budget: 1500,
        spent: 650,
        total: 4,
        purchased: 2
    },
    {
        id: 3,
        name: "週末零食採購",
        date: "2026-11-18",
        budget: 800,
        spent: 550,
        total: 5,
        purchased: 5
    }
];

function loadLists() {
    try {
        const savedLists = localStorage.getItem("smartListData");

        if (savedLists !== null) {
            const parsedLists = JSON.parse(savedLists);

            if (Array.isArray(parsedLists)) {
                return parsedLists;
            }
        }
    } catch (error) {
        console.error("讀取清單失敗：", error);
    }

    return defaultLists;
}

// 將清單資料存入瀏覽器
let lists = loadLists();

function saveLists() {
    localStorage.setItem(
        "smartListData",
        JSON.stringify(lists)
    );
}

// ==================================
// 顯示購物清單
// ==================================

function renderLists() {

    shoppingList.innerHTML = "";

    if (lists.length === 0) {
        shoppingList.innerHTML = `
            <div class="empty-message">
                <h3>目前還沒有購物清單</h3>
                <p>點擊「新增清單」開始規劃購物吧！</p>
            </div>
        `;
    }

    lists.forEach(function (list) {

        const progress = list.total > 0
            ? Math.round(list.purchased / list.total * 100)
            : 0;

        const isCompleted = list.total > 0 &&
            list.purchased === list.total;

        const dateText = list.date.replaceAll("-", "/");

        const card = document.createElement("div");
        card.className = "list-card";

card.setAttribute("role", "button");
card.tabIndex = 0;

card.addEventListener("click", function () {
    openProductModal(list.id);
});

card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProductModal(list.id);
    }
});

        card.innerHTML = `
            <div class="list-card-top">
                <span class="category-tag">🛒 購物清單</span>
                <span class="status-tag ${isCompleted ? "completed" : ""}">
                    ${isCompleted ? "已完成" : "進行中"}
                </span>
            </div>

            <h3></h3>
            <p>${dateText}</p>

            <div class="progress-info">
                <span>完成進度</span>
                <span>${list.purchased} / ${list.total} 件</span>
            </div>

            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%"></div>
            </div>

            <div class="list-footer">
                <span>預算 $${list.budget.toLocaleString("zh-TW")}</span>
                <strong>$${list.spent.toLocaleString("zh-TW")}</strong>
            </div>
        `;

        // 使用 textContent 避免清單名稱被當成 HTML 執行
        card.querySelector("h3").textContent = list.name;

        shoppingList.appendChild(card);
    });

    // 更新清單總數
    listCount.textContent = lists.length;
}

// ==================================
// 開啟新增清單視窗
// ==================================

function openModal() {
    listModal.classList.add("show");

    // 預設日期為今天
    const today = new Date();
    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    listDate.value = localDate;

    listName.focus();
}

// 關閉視窗
function hideModal() {
    listModal.classList.remove("show");
    listForm.reset();
}

// 點擊新增清單
addListBtn.addEventListener("click", openModal);

// 點擊 X 關閉
closeModal.addEventListener("click", hideModal);

// 點擊取消
cancelModal.addEventListener("click", hideModal);

// 點擊背景關閉
listModal.addEventListener("click", function (event) {
    if (event.target === listModal) {
        hideModal();
    }
});

// ==================================
// 儲存新增的購物清單
// ==================================

listForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = listName.value.trim();
    const date = listDate.value;
    const budget = Number(listBudget.value);

    // 檢查資料
    if (!name || !date || !Number.isSafeInteger(budget) || budget <= 0) {
        alert("請正確填寫清單名稱、日期及預算！");
        return;
    }

    // 建立新清單
    const newList = {
        id: Date.now(),
        name: name,
        date: date,
        budget: budget,
        spent: 0,
        total: 0,
        purchased: 0
    };

    // 加入清單陣列
    lists.unshift(newList);

    // 儲存資料
    saveLists();

    // 更新畫面
    renderLists();

    // 關閉視窗
    hideModal();

    alert("購物清單新增成功！");
});

// ==================================
// 商品管理視窗功能
// ==================================

function openProductModal(listId) {
    const selectedList = lists.find(function (list) {
        return list.id === listId;
    });

    if (!selectedList) {
        alert("找不到這份購物清單！");
        return;
    }

    const modal = document.getElementById("productModal");
    const title = document.getElementById("productModalTitle");

    if (!modal || !title) {
        console.error("找不到商品管理視窗的 HTML 元素");
        return;
    }

    title.textContent = selectedList.name;
    modal.classList.add("show");

    console.log("已開啟商品管理視窗：", selectedList.name);
}

function hideProductModal() {
    document.getElementById("productModal")?.classList.remove("show");
}

document.getElementById("closeProductModal")
    ?.addEventListener("click", hideProductModal);

document.getElementById("productModal")
    ?.addEventListener("click", function (event) {
        if (event.target === this) {
            hideProductModal();
        }
    });

// ==================================
// 啟動 SmartList
// ==================================

renderLists();

console.log("SmartList 購物清單功能已啟動！");

// ==================================
// SmartList 新增商品功能
// ==================================

// 目前正在管理的購物清單 ID
let currentListId = null;

// 取得商品表單
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

// 從 localStorage 讀取商品資料
function loadProducts() {
    try {
        const saved = localStorage.getItem("smartListProducts");
        const data = saved ? JSON.parse(saved) : [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("讀取商品失敗：", error);
        return [];
    }
}

let products = loadProducts();

// 儲存商品資料
function saveProducts() {
    localStorage.setItem(
        "smartListProducts",
        JSON.stringify(products)
    );
}

// 顯示指定清單的商品
function renderProducts() {
    productList.innerHTML = "";

    const listProducts = products.filter(function (product) {
        return product.listId === currentListId;
    });

    if (listProducts.length === 0) {
        productList.innerHTML =
            '<p class="empty-message">目前尚無商品</p>';
        return;
    }

    let totalAmount = 0;

    listProducts.forEach(function (product) {
        const subtotal = product.quantity * product.price;
        totalAmount += subtotal;

        const item = document.createElement("div");
        item.className = "product-item";

        const info = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = product.name;

        const detail = document.createElement("p");
        detail.textContent =
            `${product.category} · ${product.quantity} 件 × $${product.price}`;

        info.appendChild(name);
        info.appendChild(detail);

        const amount = document.createElement("strong");
        amount.textContent = "$" + subtotal.toLocaleString("zh-TW");

        item.appendChild(info);
        item.appendChild(amount);

        productList.appendChild(item);
    });

    const total = document.createElement("div");
    total.className = "product-total";
    total.textContent =
        "商品預計總金額：$" + totalAmount.toLocaleString("zh-TW");

    productList.appendChild(total);
}

// 取得商品表單輸入內容
productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (currentListId === null) {
        alert("請先選擇購物清單！");
        return;
    }

    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value;
    const quantity = Number(
        document.getElementById("productQuantity").value
    );
    const price = Number(
        document.getElementById("productPrice").value
    );

    if (
        !name ||
        !category ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        !Number.isSafeInteger(price) ||
        price < 0
    ) {
        alert("請正確填寫商品資料！");
        return;
    }

    const newProduct = {
        id: Date.now(),
        listId: currentListId,
        name: name,
        category: category,
        quantity: quantity,
        price: price,
        purchased: false
    };

    products.push(newProduct);

    saveProducts();
    renderProducts();

    productForm.reset();

    document.getElementById("productQuantity").value = 1;
    document.getElementById("productName").focus();

    alert("商品新增成功！");
});

// 開啟商品管理時，設定目前的清單
const originalOpenProductModal = openProductModal;

openProductModal = function (listId) {
    currentListId = listId;

    originalOpenProductModal(listId);

    renderProducts();
};

console.log("SmartList 商品新增功能已啟動！");
