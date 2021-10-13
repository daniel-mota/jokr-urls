const app = new Vue({
    el: '#app',
    data: {
        url: '',
        slug: '',
        created: null
    },
    methods: {
        async createUrl() {
            console.log(this.url, this.slug)
            console.log(`${process.env.URL}/url`);
            try {
                const response = await fetch(`${process.env.URL}/url`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: this.url,
                        slug: this.slug
                    })
                })
                this.created = await response.json();
            } catch (error) {
                console.log(error);
            }
        }
    }
})