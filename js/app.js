document.addEventListener('alpine:init', () => {
    Alpine.data('store', () => ({
        // Основное состояние
        activeTab: 'popular',
        currentPage: 'main',
        hoveredItem: null,
        playingTrack: null,
        searchQuery: '',
        cart: [],
        
        // Состояние фильтров
        filters: {
            genre: 'all',
            bpm: 'all',
            key: 'all'
        },

        // Данные формы
        formData: {
            email: '',
            name: ''
        },

        // Каталог товаров
        items: [
            {
                id: 1,
                title: 'Ночной райдер',
                artist: 'ORFI',
                price: 2999,
                genre: 'trap',
                bpm: 140,
                key: 'Am',
                likes: 234,
                plays: 1420,
                license: 'Стандартная',
                format: 'WAV + MP3',
                audioUrl: 'path/to/audio1.mp3'
            },
            {
                id: 2,
                title: 'Тёмная материя',
                artist: 'ORFI',
                price: 3499,
                genre: 'hiphop',
                bpm: 145,
                key: 'Fm',
                likes: 187,
                plays: 890,
                license: 'Стандартная',
                format: 'WAV + MP3',
                audioUrl: 'path/to/audio2.mp3'
            },
            {
                id: 3,
                title: 'Неоновые мечты',
                artist: 'ORFI',
                price: 2999,
                genre: 'rnb',
                bpm: 138,
                key: 'Em',
                likes: 342,
                plays: 2150,
                license: 'Стандартная',
                format: 'WAV + MP3',
                audioUrl: 'path/to/audio3.mp3'
            }
        ],

        // Методы для работы с корзиной
        addToCart(item) {
            if (!this.cart.find(cartItem => cartItem.id === item.id)) {
                this.cart.push(item);
            }
        },

        removeFromCart(id) {
            this.cart = this.cart.filter(item => item.id !== id);
        },

        getTotal() {
            return this.cart.reduce((sum, item) => sum + item.price, 0);
        },

        // Методы для работы с плеером
        togglePlay(trackId) {
            if (this.playingTrack === trackId) {
                this.stopTrack();
            } else {
                this.playTrack(trackId);
            }
        },

        playTrack(trackId) {
            // Здесь будет логика воспроизведения трека
            this.playingTrack = trackId;
        },

        stopTrack() {
            // Здесь будет логика остановки трека
            this.playingTrack = null;
        },

        // Методы для фильтрации и поиска
        getFilteredItems() {
            return this.items.filter(item => {
                // Фильтрация по жанру
                if (this.filters.genre !== 'all' && item.genre !== this.filters.genre) {
                    return false;
                }

                // Фильтрация по BPM
                if (this.filters.bpm !== 'all') {
                    const bpm = parseInt(item.bpm);
                    if (this.filters.bpm === 'slow' && bpm >= 140) return false;
                    if (this.filters.bpm === 'medium' && (bpm < 140 || bpm > 160)) return false;
                    if (this.filters.bpm === 'fast' && bpm <= 160) return false;
                }

                // Фильтрация по тональности
                if (this.filters.key !== 'all') {
                    const isMajor = !item.key.includes('m');
                    if (this.filters.key === 'major' && !isMajor) return false;
                    if (this.filters.key === 'minor' && isMajor) return false;
                }

                // Поиск по названию и артисту
                if (this.searchQuery) {
                    const query = this.searchQuery.toLowerCase();
                    return item.title.toLowerCase().includes(query) ||
                           item.artist.toLowerCase().includes(query);
                }

                return true;
            });
        },

        // Методы сортировки
        getSortedItems() {
            const filtered = this.getFilteredItems();
            
            switch (this.activeTab) {
                case 'popular':
                    return filtered.sort((a, b) => b.plays - a.plays);
                case 'new':
                    // Здесь можно добавить сортировку по дате, если она будет
                    return filtered;
                case 'top':
                    return filtered.sort((a, b) => b.likes - a.likes);
                default:
                    return filtered;
            }
        },

        // Методы оформления заказа
        async checkout() {
            if (this.cart.length === 0) {
                alert('Корзина пуста');
                return;
            }

            if (!this.formData.email || !this.formData.name) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            try {
                // Здесь будет отправка заказа на сервер
                const orderData = {
                    items: this.cart,
                    total: this.getTotal(),
                    customer: {
                        email: this.formData.email,
                        name: this.formData.name
                    }
                };

                // Имитация отправки заказа
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Очистка корзины и формы
                this.cart = [];
                this.formData.email = '';
                this.formData.name = '';
                
                // Переход на главную
                this.currentPage = 'main';
                
                alert('Заказ успешно оформлен!');
            } catch (error) {
                alert('Произошла ошибка при оформлении заказа');
                console.error('Checkout error:', error);
            }
        },

        // Вспомогательные методы
        formatPrice(price) {
            return new Intl.NumberFormat('ru-RU').format(price);
        },

        // Инициализация
        init() {
            // Здесь можно добавить начальную загрузку данных
            console.log('App initialized');
        }
    }));
});