// Your code here
document.addEventListener('DOMContentLoaded', async(event)=>{
    const films = await getfilm()
    console.log(films) 
    

})


function getfilm(){
return fetch("http://localhost:3000/films", {
    method: "GET",
    headers:{
        "Content-Type": "application/json",
        "Accept": "application/json"
}}
)
.then(res => res.json())
.then(films => films)
}

document.addEventListener("DOMContentLoaded", function() {
    // Make a GET request to retrieve movie details
    fetch('http://localhost:3000/films/1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Calculate available tickets
        const availableTickets = data.capacity - data.tickets_sold;
  
        // Update DOM with movie details
        document.getElementById('poster').src = data.poster;
        document.getElementById('title').textContent = data.title;
        document.getElementById('runtime').textContent = `${data.runtime} minutes`;
        document.getElementById('showtime').textContent = data.showtime;
        document.getElementById('ticket-num').textContent = availableTickets;
      })
      .catch(error => {
        console.error('There was a problem fetching the movie details:', error);
      });
  });

  document.addEventListener("DOMContentLoaded", function() {
    // Make a GET request to retrieve movie data
    fetch('http://localhost:3000/films')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const filmsList = document.getElementById('films');
        // Clear existing content (if any)
        filmsList.innerHTML = '';
  
        // Populate the list with movie data
        data.forEach(film => {
          const listItem = document.createElement('li');
          listItem.className = 'film item'; // Optional: Add class for styling
          listItem.textContent = film.title;
          filmsList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('There was a problem fetching the movie data:', error);
      });
  });

  document.addEventListener("DOMContentLoaded", function() {
    // Function to handle buying a ticket
    function buyTicket() {
      const availableTicketsElement = document.getElementById('ticket-num');
      let availableTickets = parseInt(availableTicketsElement.textContent);
  
      // Check if there are available tickets
      if (availableTickets > 0) {
        // Decrease available tickets by 1
        availableTickets--;
  
        // Update frontend
        availableTicketsElement.textContent = availableTickets;
  
        // Persist updated number of tickets_sold on the server
        const filmId = 1; // Assuming the film ID is 1 for the first movie
        fetch(`http://localhost:3000/films/${filmId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tickets_sold: availableTicketsElement
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update tickets_sold on the server');
          }
          return response.json();
        })
        .then(updatedFilm => {
          console.log('Tickets_sold updated on the server:', updatedFilm);
        })
        .catch(error => {
          console.error('There was a problem updating tickets_sold:', error);
        });
  
        // Log the new ticket purchase
        const numberOfTickets = 1; // Assuming only one ticket is bought at a time
        fetch('/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            film_id: filmId,
            number_of_tickets: numberOfTickets
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to log the new ticket purchase');
          }
          return response.json();
        })
        .then(newTicket => {
          console.log('New ticket logged:', newTicket);
        })
        .catch(error => {
          console.error('There was a problem logging the new ticket purchase:', error);
        });
      } else {
        // Show an error message or disable the button if there are no available tickets
        console.log('No available tickets!');
      }
    }
  
    // Add event listener to the "Buy Ticket" button
    const buyTicketButton = document.getElementById('buy-ticket');
    buyTicketButton.addEventListener('click', buyTicket);
  });
   
  document.addEventListener("DOMContentLoaded", function() {
    // Function to handle deleting a film
    function deleteFilm(filmId) {
      // Remove the film from the frontend
      const filmElement = document.getElementById(`film-${filmId}`);
      if (filmElement) {
        filmElement.remove();
      }
  
      // Send a DELETE request to the server to delete the film
      fetch(`http://localhost:3000/films/${filmId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete the film from the server');
        }
        return response.json();
      })
      .then(data => {
        console.log('Film deleted from the server:', data);
      })
      .catch(error => {
        console.error('There was a problem deleting the film:', error);
      });
    }
  
    // Add event listeners to the delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filmId = button.dataset.filmId;
        deleteFilm(filmId);
      });
    });
  });
  document.addEventListener("DOMContentLoaded", function() {
    // Function to handle buying a ticket
    function buyTicket(filmId) {
      const availableTicketsElement = document.getElementById(`ticket-num-${filmId}`);
      let availableTickets = parseInt(availableTicketsElement.textContent);
  
      // Check if there are available tickets
      if (availableTickets > 0) {
        // Decrease available tickets by 1
        availableTickets--;
  
        // Update frontend
        availableTicketsElement.textContent = availableTickets;
  
        // If sold out, update button text and film item in menu
        if (availableTickets === 0) {
          const filmItem = document.getElementById(`film-${filmId}`);
          if (filmItem) {
            filmItem.classList.add('sold-out');
          }
          const buyTicketButton = document.getElementById(`buy-ticket-${filmId}`);
          if (buyTicketButton) {
            buyTicketButton.textContent = 'Sold Out';
            buyTicketButton.disabled = true;
          }
        }
  
        // Persist updated number of tickets_sold on the server
        // This part remains the same as before
      } else {
        console.log('No available tickets!');
      }
    }
  
    // Add event listeners to the buy ticket buttons
    const buyTicketButtons = document.querySelectorAll('.buy-ticket-button');
    buyTicketButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filmId = button.dataset.filmId;
        buyTicket(filmId);
      });
    });
  
    // This part handles updating the film list menu when the page loads
    fetch('http://localhost:3000/films')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const filmsList = document.getElementById('films');
        filmsList.innerHTML = ''; // Clear existing content
        data.forEach(film => {
          const listItem = document.createElement('li');
          listItem.id = `film-${film.id}`;
          listItem.className = `film item`;
          if (film.tickets_sold === film.capacity) {
            listItem.classList.add('sold-out');
          }
          listItem.textContent = film.title;
          filmsList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('There was a problem fetching the movie data:', error);
      });
  });
  
  
  