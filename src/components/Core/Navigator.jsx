


export default function Navigator({requestIndex, updateRequestIndex}) {

    const [currentIndex, setCurrentIndex] = useState(requestIndex);


    const handleNextCard = () => {
        setCurrentIndex((prevIndex) => {
          let newIndex = (prevIndex + 1);
          if(prevIndex < requestData.length-1){
            
            let nextMaintenanceId = requestData[newIndex].maintenance_request_uid;
    
            updateRequestIndex(newIndex, {changeTab:'noChange'})
            return newIndex;
          }
          else{
            updateRequestIndex(newIndex, {changeTab:'forward'});
            return newIndex;
          }
      });
      };
    
      const handlePreviousCard = () => {
        setCurrentIndex((prevIndex) => {
            let newIndex = (prevIndex - 1);
            if(prevIndex > 0){
                let nextMaintenanceId = requestData[newIndex].maintenance_request_uid;
                updateRequestIndex(newIndex, {changeTab:'noChange'})
                return newIndex;
            }
            else{
                if (newIndex === -1){
                    newIndex = 1
                }
                updateRequestIndex(newIndex, {changeTab:'backward'});
                return newIndex;
            }
        });
      };

    return (
        <div>
            <h1>Navigator</h1>

            <button onClick={handlePreviousCard}>Previous</button>
            <button onClick={handleNextCard}>Next</button>
        </div>
    );
}