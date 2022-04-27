function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(intMax) {
    return Math.floor(Math.random() * (intMax+1));
}

const Ree1App = {
    data () {
        return {
            candidates : [],
            selection : "",
        };
    },
    mounted () {
        let cands = ["R1","R2","R3","R4"]; // [TODO] get from form
        cands.forEach((cand) => {
            this.candidates.push({key:cand,nominate:true});
        });
        this.selection = this.candidates[0].key;
    },
    computed: {
    },
    methods: {
        async run (event) {
            event.preventDefault();
            let nominates = this.candidates.filter((cand)=>{ return cand.nominate; });
            for(let i = 0; i < 10; i++) {
                let active = 0;
                for (; active < nominates.length; active++) {
                    this.selection = nominates[active].key;
                    var x;
                    if (i < 7) {
                        x = 100 + (i * 10);
                    } else {
                        x = 100 + (i * 50);
                    }
                    await sleep(x);
                }
            }
            let iselection = getRandomInt(nominates.length-1);
            this.selection = nominates[iselection].key
            // [TODO] blink selected item
        },
        filter (candidate,event) {
            this.candidates.forEach((cand) => {
                if(cand.key === candidate) {
                    cand.nominate = !event.target.checked;
                }
            });
        }
    },
    components: {
    }
};


window.onload =  function() {
    const app = Vue.createApp(Ree1App);
    app.mount('#app');
};
