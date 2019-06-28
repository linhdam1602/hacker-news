import React, { Component } from 'react'
// import axios from 'axios'

import Table from './components/Table'
import Search from './components/Search'
import Button from './components/Button'

import './App.css';

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '100'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`

console.log(url)
export default class App extends Component {
  state = {
    result: null,
    error: '',
    searchTerm: DEFAULT_QUERY
  }

  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id
    const updateHits = this.state.result.hits.filter(isNotId)

    this.setState({
      result: { ...this.state.result, hits: updateHits }
    })
  }

  setSearchTopStories = (result) => {
    console.log(result)

    const { hits, page } = result

    const oldHits = page !== 0
      ? this.state.result.hits
      : []

    const updateHits = [
      ...oldHits, ...hits
    ]

    this.setState({
      result: { hits: updateHits, page }
    })
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(res => res.json())
      .then(result => this.setState(this.setSearchTopStories(result)))
      .catch(err => err)
  }

  onSearchSubmit = (e) => {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
    e.preventDefault()
  }

  onSearchChange = (e) => {
    this.setState({
      searchTerm: e.target.value
    })
    console.log(this.state.searchTerm)
  }

  componentDidMount() {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
  }
  render() {
    const { result, searchTerm } = this.state
    const page = (result && result.page) || 0
    return (
      <div className='page'>
        <div className='interactions'>
          <Search
            onSubmit={this.onSearchSubmit}
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>
        {result ? <Table
          list={result.hits}
          onDismiss={this.onDismiss}
        />
          : null
        }
        <Button
          onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
          More
        </Button>
      </div>
    )
  }
}
