<template>
  <transition name="slide">
    <music-list :songs="songs" :title="tltle" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'src/api/singer'
  import {creatSong} from 'src/common/js/song'
  import {ERR_OK} from 'src/api/config'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      tltle() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatarlg
      },
      ...mapGetters([
        'singer'
      ])
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalLizeSongs(res.data.list)
          }
        })
      },
      _normalLizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          // let musicData = item.musicData
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(creatSong(musicData))
          }
        })
        return ret
      }
    },
    created() {
      this._getDetail()
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
