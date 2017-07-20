import { mapGetters, mapMutations } from 'vuex'
import { playMode } from 'src/common/js/config'
import { shuffle } from 'src/common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handleplayList(this.playList)
  },
  activated() {
    this.handleplayList(this.playList)
  },
  watch: {
    playList(newList) {
      this.handleplayList(newList)
    }
  },
  methods: {
    handleplayList() {
      throw new Error('此组件需要实现handleplayList用来实现列表不被mini播放器遮挡')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'currentSong',
      'mode',
      'playList',
      'sequenceList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._saveCurrentIndex(list)
      this.setPlayList(list)
    },
    _saveCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  }
}
