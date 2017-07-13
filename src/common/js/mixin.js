import {mapGetters} from 'vuex'

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
