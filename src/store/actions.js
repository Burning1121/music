import * as types from './mutations-types'
import { playMode } from 'src/common/js/config'
import { shuffle } from 'src/common/js/util'
import { saveSearch } from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  let randomList = shuffle(list)
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  // 加slice是因为state不允许在外部修改state的值
  // 引用类型
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 修改playList
  let fIndex = findIndex(playList, song)
  // 因为需要在当前位置增加一首歌，所以currentIndex需要+1
  currentIndex++
  playList.splice(currentIndex, 0, song)
  // 如果之前存在这首歌
  if (fIndex > -1) {
    // 存在的这首歌在插入这首歌之前
    if (currentIndex > fIndex) {
      playList.splice(fIndex, 1)
      currentIndex--
    } else {
      playList.splice(fIndex + 1, 1)
    }
  }

  // 修改sequenceList
  // 同playList的修改
  let scurrentSIndex = findIndex(sequenceList, song) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(scurrentSIndex, 0, song)

  if (fsIndex > -1) {
    if (scurrentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
