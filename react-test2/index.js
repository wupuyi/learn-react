class ProductRow extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.product.name}</td>
                <td>{this.props.product.price}</td>
                <td>{this.props.product.sales}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {

    render() {
        var rows = [];
        // var reusult = this.props.searchValue; console.log('a' + result); var rel =
        // this.props.searchValue; console.log(this.props.searchValue);
        // console.log('rel=' + rel);
        this
            .props
            .products
            .forEach((product) => {
                if (product.name.indexOf(this.props.searchValue) === -1) {
                    return;
                }
                rows.push(<ProductRow product={product} key={product.name}/>);
            });
        // console.log(rows);
        return (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>价格</th>
                        <th>销量</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {value: ''};
        this.handleChange = this
            .handleChange
            .bind(this);
    }

    handleChange(event) {
        // this.setState({value: event.target.value});
        this
            .props
            .searchValueInput(event.target.value);
    }

    render() {
        return (
            <form>
                <input
                    type="text"
                    className="search"
                    placeholder="搜索商品"
                    value={this.props.searchValue}
                    onChange={this.handleChange}/>
            </form>
        );
    }
}

class ContainerProductTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: ''
        };

        this.handleSearchValueInput = this
            .handleSearchValueInput
            .bind(this);
    }

    handleSearchValueInput(searchValue) {
        this.setState({searchValue: searchValue});
    }

    render() {
        return (
            <div>
                <SearchBar
                    searchValue={this.state.searchValue}
                    searchValueInput={this.handleSearchValueInput}/>
                <ProductTable
                    products={this.props.products}
                    searchValue={this.state.searchValue}/>
            </div>
        );
    }
}

var PRODUCTS = [
    {
        name: '电锅',
        price: '100',
        sales: '1000'
    }, {
        name: '炖锅',
        price: '100',
        sales: '1000'
    }, {
        name: '电碗',
        price: '100',
        sales: '1000'
    }, {
        name: '铁板烧',
        price: '100',
        sales: '1000'
    }, {
        name: '开水机',
        price: '100',
        sales: '1000'
    }, {
        name: '电咖啡壶',
        price: '100',
        sales: '1000'
    }, {
        name: '电茶壶',
        price: '100',
        sales: '1000'
    }, {
        name: '电炉',
        price: '100',
        sales: '1000'
    }, {
        name: '烤箱',
        price: '100',
        sales: '1000'
    }, {
        name: '面包机',
        price: '100',
        sales: '1000'
    }, {
        name: '果汁机',
        price: '100',
        sales: '1000'
    }, {
        name: '搅拌器',
        price: '100',
        sales: '1000'
    }, {
        name: '烘碗机',
        price: '100',
        sales: '1000'
    }
];

ReactDOM.render(
    <ContainerProductTable products={PRODUCTS}/>, document.getElementById('app'));