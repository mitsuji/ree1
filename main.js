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
  <div style="width:fit-content;">
    <div>
      <textarea v-model="candidatesText" cols="40" rows="20"></textarea>
    </div>
    <div style="text-align:right;">
      <button type="submit" class="submit">OK</button>&nbsp;
      <button class="close" v-on:click="close">Cancel</button>
    </div>
  </div>
</form>
  </div>
</div>
`
}

function setUiStatus (running) {
    document.querySelector("button.run").disabled = running;
    document.querySelector("button.configure").disabled = running;
    let checkboxes = document.querySelectorAll("div.reel input[type=checkbox]");
    checkboxes.forEach((elem) => { elem.disabled = running; });
}

async function blinkSelected (selection) {
    let elemLabel = document.querySelector("#" + selection + " + label");
    elemLabel.classList.add("blink");
    await sleep(2330);
    elemLabel.classList.remove("blink");
}


const Ree1App = {
    data () {
        return {
//            candidates : [],
            candidates : [{key:"Candidate1",nominate:true},
                          {key:"Candidate2",nominate:true},
                          {key:"Candidate3",nominate:true}],
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
            let nominates = this.candidates.filter((cand)=>{ return cand.nominate; });
            if(nominates.length === 0) {
                return;
            }

            // [MEMO] disable UI
            setUiStatus(true);

            for(let i = 0; i < 4; i++) {
                let active = 0;
                for (; active < nominates.length; active++) {
                    this.selection = nominates[active].key;
                    var x;
                    if (i < 3) {
                        x = 100 + (i * 10);
                    } else {
                        x = 100 + (i * 50);
                    }
                    await sleep(x);
                }
            }
            let iselection = getRandomInt(nominates.length-1);
            this.selection = nominates[iselection].key
            
            // [MEMO] blink selected item
            await blinkSelected (this.selection);

            // [MEMO] enable UI again
            setUiStatus(false);

        },
        openConfigureForm () {
            this.$refs.configureForm.open(this.candidates);
        },
        setCandidates (candidatesText) {
            this.candidates = [];
            let candidateKeys = candidatesText.trim().split(/\n/);
            let candidateKeysSet = new Set();
            // [MEMO] remove duplication
            candidateKeys.forEach((cand) => {
                candidateKeysSet.add(cand);
            });
            candidateKeysSet.forEach((cand) => {
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
