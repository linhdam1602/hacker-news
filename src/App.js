import React, { Component } from 'react'
import axios from 'axios'

import Table from './components/Table'
import Search from './components/Search'
import Button from './components/Button'

import username, { firstname, lastname } from './file1'

import './App.css';

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '100'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='
// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`

console.log(firstname, lastname)
console.log('person: ' + username)
export default class App extends Component {
  state = {
    results: null,
    error: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY
  }

  onDismiss = (id) => {
    const { searchKey, results } = this.state
    const { hits, page } = results[searchKey]

    const isNotId = item => item.objectID !== id
    const updatedHits = hits.filter(isNotId)

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    })
  }

  needsToSearchTopStories = (searchTerm) => {
    return !this.state.results[searchTerm]
  }

  setSearchTopStories = (result) => {
    console.log(result)

    const { hits, page } = result
    const { searchKey, results } = this.state

    const oldHits = results && results[searchKey] ? results[searchKey].hits : []

    const updateHits = [
      ...oldHits, ...hits
    ]

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updateHits, page }
      }
    })
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    axios.get(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this.setSearchTopStories(result.data))
      .catch(err => this.setState({ error: err }))
  }

  onSearchSubmit = (e) => {
    const { searchTerm } = this.state

    this.setState({
      searchKey: searchTerm
    })

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }
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
    this.setState({
      searchKey: searchTerm
    })

    this.fetchSearchTopStories(searchTerm)
  }
  render() {
    const { results, searchTerm, searchKey, error } = this.state
    const page = (results && results[searchKey] && results[searchKey].page) || 0
    const list = (results && results[searchKey] && results[searchKey].hits) || []

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
        {error ?
          <div className='interactions'>
            <p> Something went wrong.</p>
          </div>
          : <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        <div className='interactions'>
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    )
  }
}
