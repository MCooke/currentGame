var CurrentGame = React.createClass({
  loadGameData: function(url) {
    $.ajax({
      url: 'game571.json',
      dataType: 'json',
      success: function(data) {
        this.setState({
          data: data,
          gameID: data.gameId,
          mapId: data.mapId,
          gameMode: data.gameMode,
          participants: data.participants
        });

        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleIDSubmit: function(ID){
    url = "https://euw.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/EUW1/" + ID.id + "?api_key=e5929dd5-68d6-45bc-a816-ef49fbcedd64"
    this.loadGameData(url);
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadGameData();
    // setInterval(this.loadSummonerData);
  },
  render: function() {
    return (
      <div className="summonerInfo">
        <OpenForm onIDSubmit={this.handleIDSubmit} />
        <DisplayGame gameInfo={this.state.data} />
      </div>
    );
  }
});

var OpenForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var summonerID = this.refs.summoner.getDOMNode().value.trim();
    this.props.onIDSubmit({id: summonerID});
  },
  render: function() {
    return (
      <form className="summonerSearch" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Summoner ID" ref="summoner" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var DisplayGame = React.createClass({
  render: function(){
    // console.log('test', this.props.gameInfo);
    if ( this.props.gameInfo != null ){
      var data = this.props.gameInfo;
      return(
        <section className="gameInfo">
          <header>
            <h1>{data.gameId}</h1>
          </header>
          <div className="row">
            <h2>Players</h2>
            <PlayerList players={data.participants} />
          </div>
        </section>
      );
    } else {
      return(
        <div>test</div>
      );
    }
  }
});
var PlayersId = '';

var PlayerList = React.createClass({
	matchLeagueWithPlayer: function(data) {
		for (var key in this.props.players){
			console.log('Wood');
			// console.log(data[this.props.players[key].summonerId]);
			this.props.players[key].soloQueueTier = "Wood";
		}
	},
  getPlayerData: function() {
    $.ajax({
      url: 'https://euw.api.pvp.net/api/lol/euw/v2.5/league/by-summoner/' + PlayersId + '/entry?api_key=e5929dd5-68d6-45bc-a816-ef49fbcedd64',
      dataType: 'json',
      success: function(data) {
      	this.matchLeagueWithPlayer(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  buildString: function() {
  	PlayersId = "";
    if (this.props.players){
    	for (var key in this.props.players){
    		PlayersId = PlayersId + this.props.players[key].summonerId + ',';
    	}
    }
  },
  getInitialState: function(){
   	return null;
  },
  componentDidMount: function() {
    // setInterval(this.render, 2000);
  },
  render: function() {
    if (this.props.players){
    	this.buildString();
   		this.getPlayerData();
      var playerNodes = this.props.players.map(function(player, index) {
      return (
        <PlayerItem player={player} key={index}/>
      );
    });
    }
    return (
      <div className="list-group">
      {playerNodes}
      </div>
    );
  }
});

var PlayerItem = React.createClass({
  render: function() {
    var player = this.props.player;
    console.log(player);
    var playerIconString = '//sf.op.gg/images/profile_icons/profileIcon' + player.profileIconId + '.jpg';
    var playerTeamClass = '';
    if (player.teamId == "200"){
      playerTeamClass = 'pull-right';
    }
    return (
      <div className="Player list-group-item col-xs-6 {playerTeamClass}">
        <div className="">
          <img className="img-responsive img-thumbnail" src={playerIconString} height="50px" width="50px"/>
          <div className="caption">
            <h4>{player.summonerName} {player.soloQueueTier}</h4>
          </div>
        </div>
      </div>
    );
  }
});

React.render(
  <CurrentGame data="null"/>,
  document.getElementById('currentGame')
);