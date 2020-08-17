const TaiwanMap = new Vue({
  el: '#app',
  data: {
    h1: '縣市中文',
    h2: '縣市英文',
    city:"",
    town:"",
    year:["2005"],
    topics:[
      "辦理部會",	"辦理年度",	"社區名稱",	"社區所屬縣市",	"社區所屬區域",	"災害類型"
    ],
    forms:[],
    datas:[
      {gov:"水利署", year:"2005",name:"成功座標",city:"新北市",place:"土城區", type:"水災" },
      {gov:"水利署", year:"2005",name:"永鼎富世居社區",city:"新北市",place:"土城區", type:"水災" },
      {gov:"水利署", year:"2005",name:"京美社區",city:"新北市",place:"土城區", type:"水災" }
    ],
    gov:["水利署"]
  },
  methods: {
    viewOutcome(){
    this.getTaiwanMap();
    this.getTaiwanPoints();
     this.getForm()
    },
    getForm(){
      this.forms = this.datas.filter(i => i.year === "2005")
    },
    async getTaiwanMap() {
      const width = (this.$refs.map.offsetWidth).toFixed(),
            height = (this.$refs.map.offsetHeight).toFixed();

      // 判斷螢幕寬度，給不同放大值
      let mercatorScale, w = window.screen.width;
      if(w > 1366) {
        mercatorScale = 11000;
      }
      else if(w <= 1366 && w > 480) {
        mercatorScale = 9000;
      }
      else {
        mercatorScale = 6000;
      }

      // d3：svg path 產生器
      var path = await d3.geo.path().projection(
        // !important 座標變換函式
        d3.geo
          .mercator()
          .center([121.420952, 24.96])
          .scale(201000)
          .translate([width/2, height/2.5])
      );
      
      // 讓d3抓svg，並寫入寬高
      var svg = await d3.select('#svg')
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', `0 0 ${width} ${height}`);

      // 讓d3抓GeoJSON檔，並寫入path的路徑
      // var url = 'dist/taiwan.geojson';
      var url = 'dist/taiwancopy.geojson';

      await d3.json(url, (error, geometry) => {
        if (error) throw error;
        let newurl = geometry.features.filter(i => i.properties.name === "新北市/土城區")
      // console.log(newurl)
        svg
          .selectAll('path')
          .data(newurl)
          .enter().append('path')
          .attr('d', path)
          .attr({
            // 設定id，為了click時加class用
            id: (d) => 'city' + d.properties.COUNTYCODE
          })
          .on('click', d => {
            this.h1 = d.properties.COUNTYNAME; // 換中文名
            this.h2 = d.properties.COUNTYENG; // 換英文名
            // 有 .active 存在，就移除 .active
            if(document.querySelector('.active')) {
              document.querySelector('.active').classList.remove('active');
            }
            // 被點擊的縣市加上 .active
            document.getElementById('city' + d.properties.COUNTYCODE).classList.add('active');
          });


      });
      return svg;
    },

    async getTaiwanPoints() {
      const width = (this.$refs.map.offsetWidth).toFixed(),
            height = (this.$refs.map.offsetHeight).toFixed();

      // 判斷螢幕寬度，給不同放大值
      // let mercatorScale, w = window.screen.width;
      // if(w > 1366) {
      //   mercatorScale = 11000;
      // }
      // else if(w <= 1366 && w > 480) {
      //   mercatorScale = 9000;
      // }
      // else {
      //   mercatorScale = 6000;
      // }

      var coloor = d3.scale.category20();

      // d3：svg path 產生器
      var path = await d3.geo.path().projection(
        // !important 座標變換函式
        d3.geo
          .mercator()
          .center([121.420952, 24.96])
          .scale(101000)
          .translate([width/2, height/2.5])
      );
      // 讓d3抓svg，並寫入寬高
      var svg = await d3.select('#points')
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', `0 0 ${width} ${height}`);

      // var group = svg.append('g')

      
      // 讓d3抓GeoJSON檔，並寫入path的路徑
      var pointUrl = 'dist/points.json';

      await d3.json(pointUrl, (error, geometry) => {
        if (error) throw error;

        svg.selectAll('path')
                .data(geometry.points)
                .enter().append('path')
                .attr('fill', "pink")
                .attr('stroke', 'none')
                .attr('d', path)



      });
      return svg;
    },
  },
  mounted() {
    // this.getTaiwanPoints();
    // this.getTaiwanMap();
  }
})