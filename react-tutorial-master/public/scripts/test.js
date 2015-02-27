var SummonerInfo = React.createClass({
  loadSummonerData: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
        for (var key in this.state.data) {
          var summoner = this.state.data[key];
          this.setState({
            id: summoner.id,
            name: summoner.name
          });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadSummonerData();
    // setInterval(this.loadSummonerData);
  },
  render: function() {
    return (
      <div className="summonerInfo">
        <div><p>Summoner Name: {this.state.name}</p></div>
        <div><p>Summoner Id: {this.state.id}</p></div>
      </div>
    );
  }
});

React.render(
  <SummonerInfo url="https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/Ceranthor?api_key=e5929dd5-68d6-45bc-a816-ef49fbcedd64" />,
  document.getElementById('content')
);