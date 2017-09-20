

module.exports = generateSlug = () => {
	var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
	var slug = '';
	for (var i = 0; i < 5; i++) {
		var index = Math.floor(Math.random() * 52);
    slug += letters[index];
	}
  return slug;
}