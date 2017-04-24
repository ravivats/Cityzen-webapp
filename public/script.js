function initMap() {

	var mathikere = {
		info: '<strong>Mathikere, Bengaluru</strong><br>',
		lat: 13.033419,
		long: 77.563976
	};

	var domlur = {
		info: '<strong>Domlur, Bengaluru</strong><br>',
		lat: 12.960986,
		long: 77.638732
	};


	var locations = [
      [mathikere.info, mathikere.lat, mathikere.long],
      [domlur.info, domlur.lat, domlur.long],
    ];

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: new google.maps.LatLng(12.971599, 77.594563),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow({});

	var marker, i;

	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			map: map
		});

		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			}
		})(marker, i));
	}
}
