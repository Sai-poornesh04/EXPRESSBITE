export default function ThoughtOfTheDay(){
    const quotes=[
        "Eat well, live well, be well.",
        "People who love to eat are always the best people",
        "Food is symbolic of love when words are inadequate",
        "Life is uncertain. Eat dessert first.",
        "We all eat, and it would be a sad waste of opportunity to eat badly",
        "First, we eat. Then, we do everything else"
    ]
    const today= new Date();
    const dayofWeek=today.getDay();

    return(
        <div class="quote">
        <ul>
        <li>{quotes[dayofWeek]}</li>
        </ul>
        </div>
    )
}