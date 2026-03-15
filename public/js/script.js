router.get("/search", async (req, res) => {

  const { query } = req.query;

  const listings = await Listing.find({
    location: { $regex: query, $options: "i" }
  });

  res.render("listings/index", { allListings: listings });

});

(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()