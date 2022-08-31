function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(intMax) {
    return Math.floor(Math.random() * (intMax+1));
}

const ConfigureForm = {
    data () {
        return {
            showModal : false,
            candidatesText : "",
        };
    },
    methods : {
        open (candidates) {
            let candidateKeys = [];
            candidates.forEach((cand) => {
                candidateKeys.push(cand.key);
            });
            this.candidatesText = candidateKeys.join("\n");
            this.showModal = true;
        },
        close (event) {
            event.preventDefault();
            this.showModal = false;
        },
        submit (event) {
            event.preventDefault();
            this.$root.setCandidates(this.candidatesText);
            this.showModal = false;
        },
    },
    template: `
<div class="modal-overlay" v-show="showModal">
  <div class="modal-content">
<form v-on:submit="submit">
  <div>
    <textarea v-model="candidatesText" cols="60" rows="40"></textarea>
  </div>
  <div>
    <button type="submit" class="submit">submit</button>&nbsp;
    <button class="close" v-on:click="close">cancel</button>
  </div>
</form>
  </div>
</div>
`
}

const Ree1App = {
    data () {
        return {
//            candidates : [],
            candidates : [{key:"テスト1",nominate:true},
                          {key:"テスト2",nominate:true},
                          {key:"テスト3",nominate:true}],
            selection : "",
            running : false,
        };
    },
    mounted () {
        this.openConfigureForm();
    },
    computed: {
    },
    methods: {
        async run (event) {
            event.preventDefault();
            if(this.candidates.length === 0) {
                return;
            }
            if(this.running) {
                return;
            }
            this.running = true;

            let nominates = this.candidates.filter((cand)=>{ return cand.nominate; });
            for(let i = 0; i < 8; i++) {
                let active = 0;
                for (; active < nominates.length; active++) {
                    this.selection = nominates[active].key;
                    var x;
                    if (i < 6) {
                        x = 100 + (i * 10);
                    } else {
                        x = 100 + (i * 50);
                    }
                    await sleep(x);
                }
            }
            let iselection = getRandomInt(nominates.length-1);
            this.selection = nominates[iselection].key
            this.running = false;
            
            // [TODO] blink selected item
            let elemLabel = document.querySelector("#" + this.selection + " + label");
            for(let i = 0; i < 3; i++) {
                elemLabel.style.color = "black";
                elemLabel.style.backgroundColor = "white";
                await sleep(300);
                elemLabel.style.color = "white";
                elemLabel.style.backgroundColor = "#C00000";
                await sleep(300);
            }
        },
        filter (candidate, event) {
            if(this.running) {
                event.preventDefault();
                return;
            }
            this.candidates.forEach((cand) => {
                if(cand.key === candidate) {
                    cand.nominate = !event.target.checked;
                }
            });
        },
        openConfigureForm () {
            if(this.running) {
                return;
            }
            this.$refs.configureForm.open(this.candidates);
       },
        setCandidates (candidatesText) {
            this.candidates = [];
            let cands = candidatesText.trim().split(/\n/);
            let candsSet = new Set();
            // [MEMO] remove duplication
            cands.forEach((cand) => {
                candsSet.add(cand);
            });
            candsSet.forEach((cand) => {
                this.candidates.push({key:cand,nominate:true});
            });
            this.selection = this.candidates[0].key;
        },
    },
    components: {
        ConfigureForm,
    }
};


window.onload =  function() {
    const app = Vue.createApp(Ree1App);
    app.mount('#app');
};
