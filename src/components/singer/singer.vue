<template>
  <div class="singer" ref="singer">
    <listview @select="selectSinger" :data="singers"></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'src/api/singer.js'
  import {ERR_OK} from 'src/api/config'
  import Singer from 'common/js/singer'
  import Listview from 'src/base/listview/listview'
  import {mapMutations} from 'vuex'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((value, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: value.Fsinger_mid,
              name: value.Fsinger_name
            }))
          }

          var key = value.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
            map[key].items.push(new Singer({
              id: value.Fsinger_mid,
              name: value.Fsinger_name
            }))
          }
        })

        let ret = []
        let hot = []
        for (var j in map) {
          if (map[j].title === HOT_NAME) {
            hot.push(map[j])
          } else if (/[a-zA-Z]/.test(map[j].title)) {
            ret.push(map[j])
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      Listview
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
