const apiURL = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';

function showTabContent(tabName, element) {
    const tabContent = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = 'none';
    }
    const buttons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    document.getElementById(tabName).style.display = 'flex';
    element.classList.add('active');
    fetchProducts(tabName);
}

async function fetchProducts(category) {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        const products = data.categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase()).category_products;

        const container = document.getElementById(category);
        container.innerHTML = '';

        products.forEach(product => {
            const discountPercentage = ((product.compare_at_price - product.price) / product.compare_at_price) * 100;
            const truncatedTitle = product.title.length > 25 ? product.title.substring(0, 25) + '...' : product.title;

            const productCard = `
                <div class="product">
                    <img src="${product.image}" alt="${product.title}">
                    <p class="product-title" title="${product.title}">
                        <strong>${truncatedTitle}</strong>
                        <span class="tooltip">${product.title}</span>
                    </p>
                    <p><strong>Rs ${product.price}</strong> <span class="original-price">${product.compare_at_price}</span> <span class="discount">${discountPercentage.toFixed(2)}% Off</span></p>
                    <button>Add to Cart</button>
                </div>
            `;
            container.innerHTML += productCard;
        });

        document.querySelectorAll('.product-title').forEach(title => {
            title.addEventListener('click', function () {
                if (this.querySelector('strong').textContent.includes('...')) {
                    this.querySelector('strong').textContent = this.title;
                } else {
                    const truncatedText = this.title.length > 25 ? this.title.substring(0, 25) + '...' : this.title;
                    this.querySelector('strong').textContent = truncatedText;
                }
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

fetchProducts('men');
