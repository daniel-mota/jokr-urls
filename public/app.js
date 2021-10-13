const app = new Vue({
    el: '#app',
    data: {
        url: '',
        slug: '',
        created: ''
    },
    methods: {
        createUrl() {
            console.log(this.url, this.slug)
        }
    }
})