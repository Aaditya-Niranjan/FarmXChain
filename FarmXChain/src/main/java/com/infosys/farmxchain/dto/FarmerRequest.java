package com.infosys.farmxchain.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FarmerRequest {
    public String farmLocation;
    public String cropType;
    public String landArea;
}
