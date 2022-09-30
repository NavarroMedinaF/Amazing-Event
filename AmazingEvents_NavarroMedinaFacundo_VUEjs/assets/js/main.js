const URI = "http://amazing-events.herokuapp.com/api/events"
const locationPage = document.location.pathname
const { createApp } = Vue

createApp({
  data() {
    return {
      arrayDataComplete: [],//arrayData
      arrayFilterCards: [],//filterSeach
      arrayDataCard: [],//value1 
      arrayFilterCardDetails: [],//carDetails
      arrayFilterCardUpcoming: [],
      arrayFilterCardPast: [],//filterPast
      arrayFilterCategory: [],//las cat filtradas nameCategory
      arrayFilterCategoryChecked: [],//checkboxSelected
      arrayaHigherPercentage:[],
      arrayaLowerPercentage:[],
      arrayCapacityLarger:[],
      inputValue: "",//para el search es search
    }
    
  },
  created() {
    fetch('https://amazing-events.herokuapp.com/api/events')
      .then(response => response.json())
      .then(data => {
        let jsonAmazing = data.events
        this.arrayDataComplete = jsonAmazing
        console.log(jsonAmazing);
        if (locationPage == "/index.html") {
          this.arrayFilterCards = this.arrayDataComplete
          this.arrayDataCard = this.arrayDataComplete
          this.getArrayCategories()
          this.filterSearch()
        }
        if (locationPage == "/pastEvents.html") {
          this.arrayFilterCardPast = jsonAmazing.filter((pastEvent) => pastEvent.date < data.currentDate)
          console.log(this.arrayFilterCardPast);
          this.arrayFilterCards = this.arrayFilterCardPast
          this.arrayDataCard = this.arrayFilterCardPast
          this.getArrayCategories()
          this.filterSearch()
        }
        if (locationPage == "/upcomingEvents.html") {
          this.arrayFilterCardUpcoming = jsonAmazing.filter((pastEvent) => pastEvent.date > data.currentDate)
          console.log(this.arrayFilterCardUpcoming);
          this.arrayFilterCards = this.arrayFilterCardUpcoming
          this.arrayDataCard = this.arrayFilterCardUpcoming
          this.getArrayCategories()
          this.filterSearch()
        }
        if (locationPage == "/details.html") {
          let idDetails = location.search.split('?id=').join('')
          this.arrayFilterCardDetails = jsonAmazing.filter((card) => card._id == idDetails)

        }
        if (locationPage == "/stats.html") {          
            let events = this.arrayDataComplete
            this.arrayFilterCardPast = jsonAmazing.filter((event) => event.date < data.currentDate)
            this.arrayFilterCardUpcoming = jsonAmazing.filter((event) => event.date > data.currentDate)
            this.higherPercentageEvent(events)
            this.lowerPercentageEvent(events)
            this.eventLargerCapacity(events)
        }
      })

  },

  methods: {

    filterSearch(array) {
      
      array = this.arrayFilterCards.filter(element => element.name.toLowerCase().includes(this.inputValue.toLowerCase()))
      
      this.arrayFilterCards = array
    },
    getArrayCategories() {
      this.arrayFilterCategory = this.arrayDataCard.map(event => event.category)

      this.arrayFilterCategory = new Set(this.arrayFilterCategory)



    },
    higherPercentageEvent(arrayData) {
      let arrayFilter = arrayData.filter(event => event.assistance !== undefined)   
      let aux;
      let aux2 = 0;
      arrayFilter.forEach(event => {
        aux = (event.assistance * 100) / event.capacity
        if (aux >= aux2) {
          this.arrayaHigherPercentage = event;
          aux2 = aux
        }
      })
    },

    lowerPercentageEvent(arrayData) {
      let arrayFilter = arrayData.filter(event => event.assistance !== undefined)
      let aux;
      let aux2 = 101;
      arrayFilter.forEach(event => {
        aux = (event.assistance * 100) / event.capacity
        if (aux <= aux2) {
          this.arrayaLowerPercentage = event;
          aux2 = aux
        }
      })
    },

    eventLargerCapacity(arrayData) {
      let arrayCapacity = arrayData;
      let mapped = arrayCapacity.map(function (el, i) {
        return { index: i, value: parseInt(el.capacity) }
      })
      mapped.sort(function (a, b) {
        if (a.value > b.value) {
          return -1;
        }
        if (a.value < b.value) {
          return 1;
        }
        return 0;
      });
      this.arrayCapacityLarger = arrayCapacity.filter(events => events.capacity == mapped[0].value)[0]
      
    },

  },

  computed: {
    search() {

      if (this.arrayFilterCategoryChecked.length != 0) {
        this.arrayFilterCards = this.arrayDataCard.filter(card => { //filtramos desde el q tiene todos, porque si no esta filtrado no devuelve nada porque esta vacio, entonces lo igualo y le doy valor
          return this.arrayFilterCategoryChecked.includes(card.category)
        })
        if (this.inputValue != '') {
          this.filterSearch(this.arrayFilterCards)
        } 
      } else if (this.inputValue==""){
        this.arrayFilterCards = this.arrayDataCard
      }else{
        this.filterSearch(this.arrayFilterCards)
      }

      
      
    }
  }
}).mount('#app')
