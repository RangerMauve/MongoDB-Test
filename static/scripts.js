var model = {
	notes: [],
	currentNote: {},
	addNote: function (e) {
		e.preventDefault();
		var cn = model.currentNote;
		var note = {
			title: cn.title,
			details: cn.details,
			subnotes: (cn.subnotes || []).map(function (sn) {
				return sn.value;
			})
		};
		console.log(note);
		model.currentNote = {};
		model.notes.push(note);
		superagent("POST", "/notes/create")
			.send(note)
			.end(function (res) {
				console.log(res.body);
			});
		return false;
	},
	addSubnote: function (e) {
		e.preventDefault();
		var cn = model.currentNote;
		if (!cn.subnotes) cn.subnotes = [];
		cn.subnotes.push({
			value: "New Subnote"
		});
		return false;
	},
	removePost: function(e){
		e.preventDefault();
		var id = this.dataset.id;
		superagent("POST","/notes/"+id+"/remove").end(function(res){
			console.log(res.body);
			updateNotes();
		});
		return false;
	}
};

var binding = rivets.bind(document.querySelector("main"), model);

function updateNotes() {
	superagent("GET", "/notes/all").end(function (res) {
		var notes = res.body.notes;
		console.log(notes.slice());
		if (notes) model.notes = notes;
	});
}
updateNotes();