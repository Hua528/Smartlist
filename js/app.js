
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

const defaultCategories = [
    "生鮮食品",
    "飲料零食",
    "生活用品",
    "清潔用品",
    "肉類海鮮",
    "其他"
];

function loadCategories() {
    try {
        const savedCategories = localStorage.getItem("smartListCategories");

        if (savedCategories !== null) {
            const parsedCategories = JSON.parse(savedCategories);

            if (
                Array.isArray(parsedCategories) &&
                parsedCategories.every(function (category) {
                    return typeof category === "string";
                })
            ) {
                return [...new Set(parsedCategories)];
            }
        }
    } catch (error) {
        console.error("讀取商品分類失敗：", error);
    }

    return [...defaultCategories];
}

let categories = loadCategories();

function saveCategories() {
    localStorage.setItem(
        "smartListCategories",
        JSON.stringify(categories)
    );
}

function renderCategoryOptions() {
    const productCategory = document.getElementById("productCategory");
    const editProductCategory =
        document.getElementById("editProductCategory");

    if (!productCategory || !editProductCategory) {
        console.error("找不到商品分類欄位");
        return;
    }

    productCategory.replaceChildren(new Option("請選擇分類", ""));
    editProductCategory.replaceChildren();

    categories.forEach(function (category) {
        productCategory.add(new Option(category, category));
        editProductCategory.add(new Option(category, category));
    });
}

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
    updateBudgetReminder();

    const listProducts = products.filter(function (product) {
        return String(product.listId) === String(currentListId);
    });

    if (listProducts.length === 0) {
        productList.innerHTML =
            '<p class="empty-message">目前尚無商品</p>';
        return;
    }

    let plannedAmount = 0;
    let purchasedAmount = 0;

    listProducts.forEach(function (product) {

        const subtotal = product.quantity * product.price;
        plannedAmount += subtotal;

        if (product.purchased === true) {
            purchasedAmount += subtotal;
        }

        // 建立商品容器
        const item = document.createElement("div");
        item.className = "product-item";

        // 已購買勾選框
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "product-checkbox";
        checkbox.checked = product.purchased === true;
        checkbox.setAttribute("aria-label", "已購買：" + product.name);

        checkbox.addEventListener("change", function () {

            product.purchased = checkbox.checked;

            saveProducts();
            renderProducts();
            updateListStatistics();

        });

        // 商品資訊
        const info = document.createElement("div");
        info.className = "product-info";

        const name = document.createElement("strong");
        name.textContent = product.name;

        if (product.purchased === true) {
            name.classList.add("purchased-text");
        }

        const detail = document.createElement("p");
        detail.textContent =
            `${product.category} · ${product.quantity} 件 × $${product.price}`;

        info.appendChild(name);
        info.appendChild(detail);

        const amount = document.createElement("strong");
        amount.textContent = "$" + subtotal.toLocaleString("zh-TW");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-product";
        editButton.textContent = "編輯";
        editButton.addEventListener("click", function () {
            openEditProductModal(product.id);
        });

        // 刪除按鈕
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-product";
        deleteButton.textContent = "刪除";

        deleteButton.addEventListener("click", function () {

            const confirmed = confirm(
                "確定要刪除「" + product.name + "」嗎？"
            );

            if (!confirmed) {
                return;
            }

            products = products.filter(function (item) {
                return item.id !== product.id;
            });

            saveProducts();
            renderProducts();
            updateListStatistics();

        });

        item.appendChild(checkbox);
        item.appendChild(info);
        item.appendChild(amount);
        item.appendChild(editButton);
        item.appendChild(deleteButton);

        productList.appendChild(item);

    });

    // 顯示金額統計
    const total = document.createElement("div");
    total.className = "product-total";

    const planned = document.createElement("div");
    planned.textContent =
        "預計總金額：$" + plannedAmount.toLocaleString("zh-TW");

    const purchased = document.createElement("div");
    purchased.textContent =
        "已購買金額：$" + purchasedAmount.toLocaleString("zh-TW");

    total.appendChild(planned);
    total.appendChild(purchased);

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
updateListStatistics();

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
    updateBudgetReminder();
};

console.log("SmartList 商品新增功能已啟動！");

/* ===== 更新購物清單統計 ===== */

function updateListStatistics() {
    lists.forEach(function (list) {
        const listProducts = products.filter(function (product) {
            return String(product.listId) === String(list.id);
        });

        list.total = listProducts.length;
        list.purchased = listProducts.filter(function (product) {
            return product.purchased === true;
        }).length;
        list.spent = listProducts.reduce(function (sum, product) {
            if (product.purchased === true) {
                return sum + product.quantity * product.price;
            }
            return sum;
        }, 0);
    });

    localStorage.setItem("smartListData", JSON.stringify(lists));
    renderLists();

    const validListIds = new Set(
        lists.map(function (list) {
            return String(list.id);
        })
    );

    const validProducts = products.filter(function (product) {
        return validListIds.has(String(product.listId));
    });

    const listById = new Map(
        lists.map(function (list) {
            return [String(list.id), list];
        })
    );
    const now = new Date();
    const currentMonth =
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthlyExpenseAmount = validProducts.reduce(function (sum, product) {
        const productList = listById.get(String(product.listId));

        if (
            product.purchased !== true ||
            typeof productList.date !== "string" ||
            !productList.date.startsWith(currentMonth)
        ) {
            return sum;
        }

        return sum + product.quantity * product.price;
    }, 0);

    const productCount = document.getElementById("productCount");
    const purchasedCount = document.getElementById("purchasedCount");
    const monthlyExpense = document.getElementById("monthlyExpense");

    if (productCount) {
        productCount.textContent = validProducts.length;
    }

    if (purchasedCount) {
        purchasedCount.textContent = validProducts.filter(function (product) {
            return product.purchased === true;
        }).length;
    }

    if (monthlyExpense) {
        monthlyExpense.textContent =
            "$" + monthlyExpenseAmount.toLocaleString("zh-TW");
    }

    updateBudgetReminder();
}

function updateBudgetReminder() {
    const reminder = document.getElementById("budgetReminder");

    if (!reminder) {
        console.error("找不到預算提醒的 HTML 元素");
        return;
    }

    const selectedList = lists.find(function (list) {
        return String(list.id) === String(currentListId);
    });

    if (!selectedList) {
        reminder.hidden = true;
        reminder.classList.remove("over-budget");
        reminder.textContent = "";
        return;
    }

    const plannedAmount = products
        .filter(function (product) {
            return String(product.listId) === String(currentListId);
        })
        .reduce(function (sum, product) {
            return sum + product.quantity * product.price;
        }, 0);

    const remainingAmount = selectedList.budget - plannedAmount;
    const formattedBudget =
        selectedList.budget.toLocaleString("zh-TW");
    const formattedPlanned =
        plannedAmount.toLocaleString("zh-TW");
    reminder.hidden = false;
    reminder.classList.toggle("over-budget", remainingAmount < 0);
    reminder.textContent = remainingAmount < 0
        ? `已超出預算 $${Math.abs(remainingAmount).toLocaleString("zh-TW")}（預算 $${formattedBudget}，預計 $${formattedPlanned}）`
        : `預算尚餘 $${remainingAmount.toLocaleString("zh-TW")}（預算 $${formattedBudget}，預計 $${formattedPlanned}）`;
}

/* ===== SmartList 編輯商品功能 ===== */

let editingProductId = null;

const editProductModal =
    document.getElementById("editProductModal");

const editProductForm =
    document.getElementById("editProductForm");

document.body.appendChild(editProductModal);

function openEditProductModal(productId) {
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        alert("找不到商品！");
        return;
    }

    editingProductId = productId;

    document.getElementById("editProductName").value =
        product.name;

    document.getElementById("editProductCategory").value =
        product.category;

    document.getElementById("editProductQuantity").value =
        product.quantity;

    document.getElementById("editProductPrice").value =
        product.price;

    editProductModal.classList.add("show");
}

function closeEditProductModal() {
    editProductModal.classList.remove("show");
    editingProductId = null;
}

editProductForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const product = products.find(function (item) {
        return item.id === editingProductId;
    });

    if (!product) {
        alert("找不到商品！");
        return;
    }

    const name =
        document.getElementById("editProductName").value.trim();

    const category =
        document.getElementById("editProductCategory").value;

    const quantity = Number(
        document.getElementById("editProductQuantity").value
    );

    const price = Number(
        document.getElementById("editProductPrice").value
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

    product.name = name;
    product.category = category;
    product.quantity = quantity;
    product.price = price;

    saveProducts();
    renderProducts();
    updateListStatistics();
    updateBudgetReminder();

    closeEditProductModal();

    alert("商品修改成功！");
});

document.getElementById("closeEditProductModal")
    .addEventListener("click", closeEditProductModal);

editProductModal.addEventListener("click", function (event) {
    if (event.target === editProductModal) {
        closeEditProductModal();
    }
});

/* ===== SmartList 編輯購物清單 ===== */

const editListModal = document.getElementById("editListModal");
const editListForm = document.getElementById("editListForm");
const editListButton = document.getElementById("editListButton");

function closeEditListModal() {
    editListModal.classList.remove("show");
}

editListButton.addEventListener("click", function () {

    const selectedList = lists.find(function (list) {
        return list.id === currentListId;
    });

    if (!selectedList) {
        alert("找不到購物清單！");
        return;
    }

    document.getElementById("editListName").value =
        selectedList.name;

    document.getElementById("editListBudget").value =
        selectedList.budget;

    editListModal.classList.add("show");
});

editListForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const selectedList = lists.find(function (list) {
        return list.id === currentListId;
    });

    if (!selectedList) {
        alert("找不到購物清單！");
        return;
    }

    const newName = document
        .getElementById("editListName")
        .value.trim();

    const newBudget = Number(
        document.getElementById("editListBudget").value
    );

    if (!newName || !Number.isSafeInteger(newBudget) || newBudget < 0) {
        alert("請輸入正確的清單名稱與預算！");
        return;
    }

    selectedList.name = newName;
    selectedList.budget = newBudget;

    localStorage.setItem(
        "smartListData",
        JSON.stringify(lists)
    );

    renderLists();

    document.getElementById("productModalTitle").textContent =
        newName;

    updateBudgetReminder();

    closeEditListModal();

    alert("購物清單修改成功！");
});

document.getElementById("closeEditListModal")
    .addEventListener("click", closeEditListModal);

editListModal.addEventListener("click", function (event) {
    if (event.target === editListModal) {
        closeEditListModal();
    }
});

/* ===== 主選單導覽 ===== */

const menuLinks = document.querySelectorAll("[data-menu-action]");
const listPickerModal = document.getElementById("listPickerModal");
const listPickerForm = document.getElementById("listPickerForm");
const navListSelect = document.getElementById("navListSelect");
const categoryModal = document.getElementById("categoryModal");
const categoryForm = document.getElementById("categoryForm");
const categoryNameInput = document.getElementById("categoryName");
const categoryList = document.getElementById("categoryList");
let pendingNavigationAction = null;

function closeListPicker() {
    listPickerModal.classList.remove("show");
    pendingNavigationAction = null;
}

function renderListPicker() {
    navListSelect.replaceChildren();

    lists.forEach(function (list) {
        navListSelect.add(new Option(list.name, String(list.id)));
    });

    const currentListOption = [...navListSelect.options].find(function (option) {
        return option.value === String(currentListId);
    });

    if (currentListOption) {
        navListSelect.value = currentListOption.value;
    }
}

function openListPicker(action) {
    if (lists.length === 0) {
        alert("目前沒有購物清單，請先新增清單。");
        openModal();
        return;
    }

    pendingNavigationAction = action;
    document.getElementById("listPickerTitle").textContent =
        action === "budget" ? "選擇要編輯預算的清單" : "選擇要管理商品的清單";
    renderListPicker();
    listPickerModal.classList.add("show");
}

function renderCategoryList() {
    categoryList.replaceChildren();

    categories.forEach(function (category) {
        const row = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = category;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-category";
        deleteButton.textContent = "刪除";
        deleteButton.addEventListener("click", function () {
            if (categories.length === 1) {
                alert("至少需要保留一個商品分類！");
                return;
            }

            if (products.some(function (product) {
                return product.category === category;
            })) {
                alert("此分類已有商品使用，無法刪除。");
                return;
            }

            categories = categories.filter(function (item) {
                return item !== category;
            });
            saveCategories();
            renderCategoryOptions();
            renderCategoryList();
        });

        row.appendChild(name);
        row.appendChild(deleteButton);
        categoryList.appendChild(row);
    });
}

menuLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const action = link.dataset.menuAction;
        menuLinks.forEach(function (menuLink) {
            menuLink.classList.toggle("active", menuLink === link);
        });

        if (action === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (action === "lists") {
            document.getElementById("shoppingListSection")
                .scrollIntoView({ behavior: "smooth" });
        } else if (action === "products" || action === "budget") {
            openListPicker(action);
        } else if (action === "categories") {
            renderCategoryList();
            categoryModal.classList.add("show");
        }
    });
});

document.getElementById("closeListPicker")
    .addEventListener("click", closeListPicker);
document.getElementById("cancelListPicker")
    .addEventListener("click", closeListPicker);
listPickerModal.addEventListener("click", function (event) {
    if (event.target === listPickerModal) {
        closeListPicker();
    }
});

listPickerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedList = lists.find(function (list) {
        return String(list.id) === navListSelect.value;
    });

    if (!selectedList) {
        alert("找不到這份購物清單！");
        return;
    }

    const action = pendingNavigationAction;
    closeListPicker();
    openProductModal(selectedList.id);

    if (action === "budget") {
        editListButton.click();
    }
});

document.getElementById("closeCategoryModal")
    .addEventListener("click", function () {
        categoryModal.classList.remove("show");
    });
categoryModal.addEventListener("click", function (event) {
    if (event.target === categoryModal) {
        categoryModal.classList.remove("show");
    }
});

categoryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const category = categoryNameInput.value.trim();

    if (!category) {
        alert("請輸入分類名稱！");
        return;
    }

    if (categories.includes(category)) {
        alert("這個分類已經存在！");
        return;
    }

    categories.push(category);
    saveCategories();
    renderCategoryOptions();
    renderCategoryList();
    categoryForm.reset();
    categoryNameInput.focus();
});

/* ===== SmartList 刪除整份購物清單 ===== */

const deleteListButton =
    document.getElementById("deleteListButton");

deleteListButton.addEventListener("click", function () {

    // 找出目前正在管理的清單
    const selectedList = lists.find(function (list) {
        return list.id === currentListId;
    });

    if (!selectedList) {
        alert("找不到這份購物清單！");
        return;
    }

    // 二次確認，避免誤刪
    const confirmed = confirm(
        "確定要刪除「" + selectedList.name + "」嗎？\n\n" +
        "這份清單內的所有商品也會一起刪除，且無法復原。"
    );

    if (!confirmed) {
        return;
    }

    // 只刪除目前這份清單
    const listIdToDelete = selectedList.id;

    lists = lists.filter(function (list) {
        return list.id !== listIdToDelete;
    });

    // 同步刪除這份清單的商品
    products = products.filter(function (product) {
        return product.listId !== listIdToDelete;
    });

    // 儲存更新後的資料
    localStorage.setItem(
        "smartListData",
        JSON.stringify(lists)
    );

    saveProducts();

    // 關閉商品管理視窗
    hideProductModal();
    currentListId = null;

    // 更新首頁卡片與統計
    updateListStatistics();

    alert("購物清單及其商品已刪除！");
});

renderCategoryOptions();
updateListStatistics();
