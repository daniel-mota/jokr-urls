const app = new Vue({
    el: '#app',
    data: {
        url: '',
        slug: '',
        created: null,
        formVisible: true,
        error: ''
    },
    methods: {
        async createUrl() {
            console.log(this.url, this.slug)
            try {
                const response = await fetch(`https://jokrurls.herokuapp.com/url`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: this.url,
                        slug: this.slug || undefined
                    })
                })
                const result = await response.json();
                if (response.ok) {
                    this.formVisible = false;
                    this.created = `https://jokrurls.herokuapp.com/${result.slug}`
                } else {
                    this.error = result.message
                }
            } catch (error) {
                console.log(error);
            }
        },
        createAnother() {
            this.created = null
            this.formVisible = true
            this.url = ''
            this.slug = ''
            this.error = ''
        }
    }
})