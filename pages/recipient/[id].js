function Recipient({ recipient, payments }) {
  return (
    <div>
      <h1>{recipient.name}</h1>
      <ul>
        {payments.map(({ pk, year, scheme, amount }) => (
          <li key={pk}>{year} | {scheme} | {amount}</li>
        ))}
      </ul>
    </div>
  );

}

// This gets called on every request
export async function getServerSideProps({ params }) {
  // Fetch data from external API
  const res = await fetch(`https://api.farmsubsidy-next.medienrevolte.de/recipients?recipient_id=${params.id}`)
  const { results: recipients } = await res.json()
  const recipient = recipients[0]

  const paymentsRes = await fetch(`https://api.farmsubsidy-next.medienrevolte.de/payments?recipient_id=${params.id}`)
  const { results: payments } = await paymentsRes.json()

  // Pass data to the page via props
  return { props: { recipient, payments } }
}

export default Recipient

