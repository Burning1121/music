<template>
  <transition name="slide">
    <music-list :rank="rank" :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getMusicList } from 'src/api/rank'
  import { ERR_OK } from 'src/api/config'
  import { creatSong } from 'src/common/js/song'

  export default {
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return this.topList.picUrl
      },
      ...mapGetters([
        'topList'
      ])
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalLizeSongs(res.songlist)
          }
        })
      },
      _normalLizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let musicData = item.data
          if (musicData.songid && musicData.albummid) {
            ret.push(creatSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
