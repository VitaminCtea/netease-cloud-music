import React, {useMemo} from "react"
import { padZero } from "helper/index"
import './index.sass'

const Recommend = () => {
    const memoize = useMemo(() => padZero(new Date().getDate()), [])
    return (
        <div className={ 'icon-recommend' }>
            <div className={ 'calendar' }>
                <div className={ 'content' }>
                    <span className={ 'date' }>{ memoize }</span>
                </div>
            </div>
        </div>
    )
}

export default Recommend