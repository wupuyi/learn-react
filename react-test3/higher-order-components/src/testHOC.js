import React, {Component} from 'react';

class Post extends Component {
  render () {
    return (
      <div>
        <p>{this.props.content}</p>
        <button onClick={() => this.props.refresh()}>刷新</button>
      </div>
    )
  }
}

// Post = loadAndRefresh('/post')(Post)

const loadAndRefresh = (url) => {

  return (WrappedComponent) => {
    class NewCompoent extends Component {
      constructor (props) {
        super(props)
        this.state = {
          content: '数据加载中...'
        }
      }

      async handleRefresh () {
        this.setState({
          content: '数据加载中...'
        })
        const content = await getData(url)
        this.setState({ content })
      }

      componentDidMount () {
        this.handleRefresh()
      }

      render () {
        const props = {
          content: this.state.content,
          refresh: this.handleRefresh.bind(this),
          ...this.props
        }
        return <WrappedComponent {...props}/>
      }
    }

    return NewCompoent
  }
}

Post = loadAndRefresh('/post')(Post)