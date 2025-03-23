document.addEventListener('alpine:init', () => {
    Alpine.data('store', () => ({
        // Основное состояние
        activeTab: 'popular',
        currentPage: 'main',
        hoveredItem: null,
        playingTrack: null,
        searchQuery: '',
        cart: [],
        isAuthenticated: false,

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
                title: 'Brazill Phonk',
                artist: 'ORFI',
                price: 2999,
                genre: 'phonk',
                bpm: 140,
                key: 'Am',
                likes: 234,
                plays: 1420,
                license: 'Стандартная',
                format: 'WAV + MP3',
                audioUrl: 'audio/audio1.mp3',
                imageUrl: 'images/image1.jpg',
                isLiked: false
            },
            {
                id: 2,
                title: 'Bellbillie Eilish AI',
                artist: 'ORFI',
                price: 3499,
                genre: 'hiphop',
                bpm: 145,
                key: 'Fm',
                likes: 187,
                plays: 890,
                license: 'Стандартная',
                format: 'WAV + MP3',
                audioUrl: 'audio/audio2.mp3',
                imageUrl: 'images/image2.jpg',
                isLiked: false
            },
            {
                id: 3,
                title: 'Ambient',
                artist: 'ORFI',
                price: 2999,
                genre: 'rnb',
                bpm: 138,
                key: 'Em',
                likes: 342,
                plays: 2150,
                license: 'Стандартная',
                format: 'WAV + MP3',
                audioUrl: 'audio/audio3.mp3',
                imageUrl: 'images/image3.jpg',
                isLiked: false
            },
            {
                id: 4,
                title: 'Russian Phonk',
                artist: 'ORFI',
                price: 2999,
                genre: 'rnb',
                bpm: 140,
                key: 'Em',
                likes: 1,
                plays: 2,
                license: 'Стандартная',
                format: 'WAV + MP3',
                audioUrl: 'audio/audio4.mp3',
                imageUrl: 'images/image4.jpg',
                isLiked: false
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
            const audioElement = document.getElementById('audioPlayer');
            const track = this.items.find(item => item.id === trackId);

            if (track) {
                audioElement.src = track.audioUrl;
                audioElement.play();
                this.playingTrack = trackId;
                track.plays += 1;
                this.saveState();
            }
        },

        stopTrack() {
            const audioElement = document.getElementById('audioPlayer');
            audioElement.pause();
            audioElement.currentTime = 0;
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

        // Методы лайка
        toggleLike(itemId) {
            const item = this.items.find(item => item.id === itemId);
            if (item) {
                item.isLiked = !item.isLiked;
                if (item.isLiked) {
                    item.likes += 1;
                } else {
                    item.likes -= 1;
                }
                this.saveState();
            }
        },

        // Методы прослушиваний
        incrementPlays(itemId) {
            const item = this.items.find(item => item.id === itemId);
            if (item) {
                item.plays += 1;
                this.saveState();
            }
        },

        // Сохранение состояния в localStorage
        saveState() {
            localStorage.setItem('items', JSON.stringify(this.items));
        },

        // Загрузка состояния из localStorage
        loadState() {
            const savedState = localStorage.getItem('items');
            if (savedState) {
                this.items = JSON.parse(savedState);
            }
        },

        // Вспомогательные методы
        formatPrice(price) {
            return new Intl.NumberFormat('ru-RU').format(price);
        },

        // Инициализация
        init() {
            this.loadState();
            console.log('App initialized');
        }
    }));
});
