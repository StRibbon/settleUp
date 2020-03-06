import React, { Component } from "react";
import ReactDOM from "react-dom";

const seedList = [
    {name: 'Abby', paid: 100 },
    {name: 'Bill', paid: 1000 },
    {name: 'Charles', paid: 400 }
];

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      paid: 0,
      list: seedList,
      payments: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
  };

  componentDidMount() {
    this.settleUp();
  };

  handleInputChange(e) {
    const target = e.target;
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  onAddItem() {
    this.setState(state => {
      console.log(state);
      const list = state.list.concat({
        name: state.name,
        paid: Number(state.paid)
      });
      return {
        list,
        name: '',
        paid: 0
      };
    }, () => this.settleUp());
  };

  settleUp() {
    let groupCount = 0;
    let totalSum = 0;
    let avgOwed = 0;
    let payments = [];
    const {list} = this.state;
    // get totalSum and group count
    for (var i in list) {
      groupCount = list.length;
      totalSum += list[i]['paid'];
    }
    // determine how much each person owes or owed
    // owed will be a negative integer while owes will be positive
    avgOwed = totalSum/groupCount;
    for (var j in list) {
      list[j]['owes'] = avgOwed - list[j]['paid'];
    }
    // sort by highest owed ascending
    const compare = (a,b) => {
      if (a.owes > b.owes) {
        return 1;
      };
      if (b.owes > a.owes) {
        return -1;
      }
    };
    list.sort(compare);
    console.log(list);
    // initial loop starting with person owed the most
    for (var k in list) {
      if (list[k].owes !== 0 && list[k].owes < 0) {
        // descending loop from person who owes the most
        for (var l = list.length - 1; l >= 0; l--) {
          if (list[k].name !== list[l].name) {
            // amount owes paid to amount owed
            list[k].owes = list[k].owes + list[l].owes;
            // add proposed transactions to array
            payments.push(`${list[l].name} pays ${list[k].name}: ${list[l].owes}`)
            list[l].owes = 0;
          }
        }
      }
    }
    console.log(list);
    this.setState({ payments });
  }

  render() {
    return (
      <div>
        <div>
          Determine payments for min # of transactions in shared expense group
        </div>
        <br />
        <div>Group Expenses:</div>
        <ul>
          {this.state.list.map(item => (
            <li key={item.name}>{item.name} paid ${item.paid}</li>
          ))}
        </ul>
        <br />
        <div>Settling up:</div>
        <ul>
          {this.state.payments.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <label>Name:</label>
        <input
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.handleInputChange}
        />
        <label>Paid:</label>
        <input
          name="paid"
          type="number"
          value={this.state.paid}
          onChange={this.handleInputChange}
        />
        <button
          type="button"
          onClick={this.onAddItem}
          disabled={!this.state.paid}
        >
          Add
        </button>
      </div>
    );
  }
}

export default Form;

const wrapper = document.getElementById("container");
wrapper ? ReactDOM.render(<Form />, wrapper) : false;
